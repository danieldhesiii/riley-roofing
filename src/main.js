/* Riley Roofing — progressive enhancement only.
   All content and styling work without this file; JS just adds
   smooth scroll, reveal animations, the estimate calculator,
   the reviews carousel, review submission, and calendar booking. */

import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Splitting from "splitting";
import Swiper from "swiper";
import { Autoplay } from "swiper/modules";
import "splitting/dist/splitting.css";
import "swiper/css";

gsap.registerPlugin(ScrollTrigger);
document.documentElement.classList.add("js");
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- 1. Smooth scroll (Lenis + GSAP ticker) ---------- */
let lenis;
if (!reduce) {
  lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
function goTo(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -68 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/* ---------- 2. Header, drawer, anchors ---------- */
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("is-stuck", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const drawer = document.querySelector(".drawer");
const burger = document.querySelector(".burger");
function closeDrawer() {
  drawer.hidden = true;
  burger.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
burger.addEventListener("click", () => {
  const open = drawer.hidden;
  drawer.hidden = !open;
  burger.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
});
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const t = a.getAttribute("href");
    if (t.length > 1 && document.querySelector(t)) {
      e.preventDefault();
      closeDrawer();
      goTo(t);
    }
  });
});
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- 2.5 Service category filter ---------- */
const svcTabs = document.querySelectorAll(".svc-tab");
if (svcTabs.length) {
  const serviceCards = gsap.utils.toArray(".services .card");
  svcTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const cat = tab.dataset.cat;
      svcTabs.forEach((t) => {
        const on = t === tab;
        t.classList.toggle("is-active", on);
        t.setAttribute("aria-selected", String(on));
      });
      serviceCards.forEach((card) => {
        const show = cat === "all" || card.dataset.cat === cat;
        card.classList.toggle("is-hidden", !show);
        if (show && !reduce) {
          gsap.fromTo(card, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out", overwrite: true });
        }
      });
      if (typeof ScrollTrigger !== "undefined") ScrollTrigger.refresh();
    });
  });
}

/* ---------- 3. Reveal animations ---------- */
if (!reduce) {
  const splits = Splitting({ target: ".hero__title", by: "words" });
  if (splits[0]) {
    gsap.from(splits[0].words, { y: 30, opacity: 0, duration: 0.6, ease: "power3.out", stagger: 0.05, delay: 0.1 });
  }
  const groups = [
    [".sec-head", 0], [".card", 0.06], [".g", 0.05], [".feature", 0.06],
    [".cleaning__copy", 0], [".cleaning__media", 0], [".why__copy", 0], [".why__media", 0],
    [".calc", 0], [".estimate__intro", 0], [".rev", 0.05], [".method", 0.06], [".booking", 0], [".hero__copy > *", 0.05],
  ];
  groups.forEach(([sel, stagger]) => {
    const els = gsap.utils.toArray(sel);
    els.forEach((el) => el.classList.add("reveal"));
    ScrollTrigger.batch(els, {
      start: "top 90%",
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", stagger: stagger, overwrite: true }),
    });
  });
}

/* ---------- 4. Estimate calculator ---------- */
const calc = document.getElementById("calc");
if (calc) {
  const state = { job: "repair", property: "terraced", covering: "tile", access: "standard" };
  const BASE = { repair: [180, 650], flat: [1400, 4200], reroof: [4500, 12000], gutter: [350, 1600], chimney: [450, 2200] };
  const PROP = { terraced: 0.85, semi: 1, detached: 1.35, bungalow: 1.1 };
  const COVER = { tile: 1, slate: 1.28, felt: 0.9 };
  const ACCESS = { standard: 1, awkward: 1.22 };
  const lowEl = document.getElementById("calcLow");
  const highEl = document.getElementById("calcHigh");

  function animateTo(el, value) {
    const obj = { v: parseInt(el.dataset.v || "0", 10) };
    if (reduce) { el.textContent = "£" + (Math.round(value / 10) * 10).toLocaleString(); el.dataset.v = value; return; }
    gsap.to(obj, { v: value, duration: 0.5, ease: "power2.out",
      onUpdate: () => { el.textContent = "£" + (Math.round(obj.v / 10) * 10).toLocaleString(); },
      onComplete: () => { el.dataset.v = value; } });
  }
  function update() {
    const [lo, hi] = BASE[state.job];
    const m = PROP[state.property] * COVER[state.covering] * ACCESS[state.access];
    animateTo(lowEl, lo * m);
    animateTo(highEl, hi * m);
  }
  calc.querySelectorAll(".chipset").forEach((set) => {
    set.addEventListener("click", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      set.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      state[set.dataset.name] = chip.dataset.value;
      update();
    });
  });
  update();
}

/* ---------- 5. Reviews carousel + submission ---------- */
const STORE = "riley_reviews_v1";
const track = document.getElementById("reviewsTrack");
let reviewSwiper;
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function initials(name) { return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase(); }
function slideHTML(r) {
  const stars = "★★★★★".slice(0, r.stars) + "☆☆☆☆☆".slice(0, 5 - r.stars);
  return `<div class="swiper-slide"><div class="rev"><div class="rev__stars">${stars}</div>` +
    `<p class="rev__text">${escapeHtml(r.text)}</p><div class="rev__meta"><span class="rev__ava">${initials(r.name)}</span>` +
    `<span class="rev__who"><b>${escapeHtml(r.name)}</b><i>via ${escapeHtml(r.place)}</i></span></div></div></div>`;
}
function storedReviews() { try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch { return []; } }

if (track) {
  // Prepend any locally-saved reviews ahead of the seed reviews in the HTML.
  storedReviews().forEach((r) => track.insertAdjacentHTML("afterbegin", slideHTML(r)));
  function initReviews() {
    if (reviewSwiper) reviewSwiper.destroy(true, true);
    reviewSwiper = new Swiper(".reviews__carousel", {
      modules: [Autoplay],
      slidesPerView: 1.1, spaceBetween: 20, centeredSlides: false, loop: true, grabCursor: true,
      autoplay: reduce ? false : { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true },
      breakpoints: { 640: { slidesPerView: 2, spaceBetween: 22 }, 1024: { slidesPerView: 3, spaceBetween: 24 } },
    });
  }
  initReviews();

  const reviewForm = document.getElementById("reviewForm");
  document.getElementById("openReviewForm").addEventListener("click", () => {
    reviewForm.hidden = false;
    reviewForm.scrollIntoView({ behavior: "smooth", block: "center" });
  });
  document.getElementById("cancelReview").addEventListener("click", () => { reviewForm.hidden = true; });

  let rating = 5;
  const starBtns = document.querySelectorAll("#rfStars button");
  const paint = (n) => starBtns.forEach((b) => b.classList.toggle("is-on", +b.dataset.star <= n));
  starBtns.forEach((b) => {
    b.addEventListener("click", () => { rating = +b.dataset.star; paint(rating); });
    b.addEventListener("mouseenter", () => starBtns.forEach((x) => x.classList.toggle("is-hover", +x.dataset.star <= +b.dataset.star)));
    b.addEventListener("mouseleave", () => starBtns.forEach((x) => x.classList.remove("is-hover")));
  });
  paint(rating);

  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("rfName").value.trim();
    const place = document.getElementById("rfPlace").value.trim() || "Website";
    const text = document.getElementById("rfText").value.trim();
    if (!name || !text) return;
    const review = { name, place, stars: rating, text };
    const extra = storedReviews();
    extra.unshift(review);
    localStorage.setItem(STORE, JSON.stringify(extra));
    track.insertAdjacentHTML("afterbegin", slideHTML(review));
    reviewForm.reset(); rating = 5; paint(5); reviewForm.hidden = true;
    initReviews();
  });
}

/* ---------- 6. Booking + calendar (.ics + Google Calendar) ---------- */
const booking = document.getElementById("booking");
if (booking) {
  const dateInput = document.getElementById("bDate");
  dateInput.value = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  dateInput.min = new Date().toISOString().slice(0, 10);

  const pad = (n) => String(n).padStart(2, "0");
  const toUTC = (d) => d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" +
    pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + "00Z";
  const window_ = (l) => (l.startsWith("Morning") ? [8, 12] : l.startsWith("Afternoon") ? [12, 17] : [17, 19]);

  booking.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = (id) => document.getElementById(id).value.trim();
    const name = val("bName"), phone = val("bPhone");
    const date = document.getElementById("bDate").value;
    if (!name) return document.getElementById("bName").focus();
    if (!phone) return document.getElementById("bPhone").focus();
    if (!date) return dateInput.focus();

    const email = val("bEmail"), service = document.getElementById("bService").value;
    const timeLabel = document.getElementById("bTime").value, postcode = val("bPostcode"), notes = val("bNotes");
    const [sh, eh] = window_(timeLabel);
    const start = new Date(`${date}T${pad(sh)}:00:00`);
    const end = new Date(`${date}T${pad(eh)}:00:00`);
    const title = "Riley Roofing — Free Quote Visit";
    const details = `Free no-obligation roofing quote.\n\nName: ${name}\nPhone: ${phone}\n` +
      (email ? `Email: ${email}\n` : "") + `Job: ${service}\nPreferred window: ${timeLabel}\n` +
      (postcode ? `Postcode: ${postcode}\n` : "") + (notes ? `Notes: ${notes}\n` : "") +
      `\nRiley Roofing & Property Maintenance · 07791 995977`;
    const location = postcode || "10 Ashford Dr, Bedworth CV12 8QJ";

    document.getElementById("gcalLink").href =
      "https://calendar.google.com/calendar/render?action=TEMPLATE&text=" + encodeURIComponent(title) +
      "&dates=" + toUTC(start) + "/" + toUTC(end) + "&details=" + encodeURIComponent(details) +
      "&location=" + encodeURIComponent(location);

    const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Riley Roofing//Booking//EN", "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH", "BEGIN:VEVENT", "UID:" + Date.now() + "@rileyroofing", "DTSTAMP:" + toUTC(new Date()),
      "DTSTART:" + toUTC(start), "DTEND:" + toUTC(end), "SUMMARY:" + title,
      "DESCRIPTION:" + details.replace(/\n/g, "\\n"), "LOCATION:" + location.replace(/,/g, "\\,"),
      "BEGIN:VALARM", "TRIGGER:-PT2H", "ACTION:DISPLAY", "DESCRIPTION:Riley Roofing visit reminder",
      "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    document.getElementById("icsLink").href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));

    document.getElementById("confirmName").textContent = name.split(" ")[0];
    document.getElementById("confirmWhen").textContent =
      start.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) + " · " + timeLabel;
    const confirm = document.getElementById("bookingConfirm");
    confirm.hidden = false;
    confirm.scrollIntoView({ behavior: "smooth", block: "center" });
    if (!reduce) gsap.from(confirm, { y: 18, opacity: 0, duration: 0.5, ease: "power2.out" });
  });
}

window.addEventListener("load", () => ScrollTrigger.refresh());
