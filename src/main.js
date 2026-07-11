import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Splitting from "splitting";
import Swiper from "swiper";
import { Autoplay, FreeMode } from "swiper/modules";

import "splitting/dist/splitting.css";
import "swiper/css";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   1. LENIS SMOOTH SCROLL — driven by GSAP ticker (single clock)
   ============================================================ */
let lenis;
if (!prefersReduced) {
  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000)); // s -> ms
  gsap.ticker.lagSmoothing(0);
}

function scrollToTarget(target) {
  const el = document.querySelector(target);
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { offset: -70 });
  else el.scrollIntoView({ behavior: "smooth" });
}

/* ============================================================
   2. DATA — real Riley Roofing content
   ============================================================ */
const SERVICES = {
  roofing: [
    { t: "New roofs & full re-roofs", d: "Complete strip and re-cover, done tidy and built to outlast the weather." },
    { t: "Pitched & tiled roofs", d: "Concrete and clay tiling, from patch repairs to the whole roof." },
    { t: "Natural slate roofing", d: "Traditional slate laid and repaired the proper way." },
    { t: "Flat roofing", d: "Felt, EPDM rubber and GRP fibreglass systems for extensions and garages." },
  ],
  repairs: [
    { t: "Storm & leak repairs", d: "Fast response after bad weather — we're on 24-hour call-out." },
    { t: "Slipped & broken tiles", d: "Loose, cracked or missing tiles matched and refixed." },
    { t: "Chimney repairs & repointing", d: "Repointing, flaunching and flashing to stop the water getting in." },
    { t: "Ridge & hip re-bedding", d: "Loose ridge tiles re-bedded and pointed for a watertight finish." },
  ],
  finishings: [
    { t: "Dry verges", d: "A clean, mortar-free verge that won't crack or come loose — a customer favourite." },
    { t: "Fascias & soffits", d: "Fresh uPVC fascias and soffits to smarten up and protect the roofline." },
    { t: "Guttering", d: "Cleaning, repairs and full replacement to keep water where it belongs." },
    { t: "Lead work & flashing", d: "Proper lead flashing around chimneys, valleys and abutments." },
  ],
  maintenance: [
    { t: "Pointing & brickwork", d: "Repointing and small brickwork repairs to keep the property sound." },
    { t: "Roof & render cleaning", d: "Moss removal and pressure washing to bring things back to life." },
    { t: "uPVC & cladding", d: "Cladding, bargeboards and trims supplied and fitted." },
    { t: "General property maintenance", d: "The odd jobs most firms won't touch — just ask." },
  ],
};

const GALLERY = [
  { img: "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&w=1200&q=70", cap: "Full re-roof", loc: "Bedworth" },
  { img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=70", cap: "New tiled roof", loc: "Nuneaton" },
  { img: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=900&q=70", cap: "Fascias & soffits", loc: "Coventry" },
  { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=70", cap: "Dry verge finish", loc: "Hinckley" },
  { img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=70", cap: "Detached re-roof", loc: "Rugby" },
  { img: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=70", cap: "Storm repair", loc: "Bedworth" },
  { img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=900&q=70", cap: "Flat roof, rubber", loc: "Leamington" },
  { img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=70", cap: "Chimney & lead work", loc: "Warwickshire" },
];

const SEED_REVIEWS = [
  { name: "James Melvyn Forster", place: "Google", stars: 5, text: "Absolutely wonderful service and prices." },
  { name: "Sue Witt", place: "Google", stars: 5, text: "Extremely happy with the price, the work & the timescales. Wouldn't hesitate to recommend." },
  { name: "Paul Goff", place: "Google", stars: 5, text: "We had dry verges fitted by Riley Roofing and they did an excellent job. Tidy and on time." },
  { name: "Karen H.", place: "Facebook", stars: 5, text: "Came out same day after the storm took some tiles off. Sorted quickly, fair price, lovely lads." },
  { name: "Dave P.", place: "Yell", stars: 5, text: "Full re-roof on our semi. Left the place spotless. Can't fault them." },
  { name: "Margaret S.", place: "Google", stars: 5, text: "Free quote, no pressure, and the finished roof looks brilliant. Local and trustworthy." },
];

/* ============================================================
   3. RENDER: SERVICES (with category tabs)
   ============================================================ */
const grid = document.getElementById("servicesGrid");
function renderServices(cat) {
  grid.innerHTML = SERVICES[cat]
    .map(
      (s, i) => `
      <article class="svc">
        <span class="svc__num">${String(i + 1).padStart(2, "0")}</span>
        <div class="svc__body">
          <h3>${s.t}</h3>
          <p>${s.d}</p>
        </div>
      </article>`
    )
    .join("");
  gsap.from(grid.querySelectorAll(".svc"), {
    y: 24, opacity: 0, duration: 0.5, stagger: 0.06, ease: "power2.out",
  });
}
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
    tab.classList.add("is-active");
    renderServices(tab.dataset.cat);
  });
});
renderServices("roofing");

/* ============================================================
   4. RENDER: GALLERY (with graceful fallback tiles)
   ============================================================ */
const galleryGrid = document.getElementById("galleryGrid");
galleryGrid.innerHTML = GALLERY.map(
  (g) => `
    <figure class="gtile">
      <img src="${g.img}" alt="${escapeHtml(g.cap)} in ${escapeHtml(g.loc)}" loading="lazy" />
      <figcaption class="gtile__cap"><span>${g.loc}</span>${g.cap}</figcaption>
    </figure>`
).join("");
// Graceful fallback: if a photo fails to load, turn the tile into a
// designed placeholder rather than a broken image.
galleryGrid.querySelectorAll(".gtile").forEach((tile, i) => {
  const img = tile.querySelector("img");
  img.addEventListener("error", () => {
    tile.classList.add("gtile--fallback");
    img.remove();
    tile.insertAdjacentHTML(
      "afterbegin",
      `<div class="gtile__ph">${escapeHtml(GALLERY[i].cap)}<br>${escapeHtml(GALLERY[i].loc)}</div>`
    );
  });
});

/* ============================================================
   5. ESTIMATE CALCULATOR
   ============================================================ */
const calc = document.getElementById("calc");
const calcState = { job: "repair", property: "terraced", covering: "tile", access: "standard" };

// Base guide ranges (£) per job type — deliberately wide "ballpark" bands.
const BASE = {
  repair: [180, 650],
  flat: [1400, 4200],
  reroof: [4500, 12000],
  gutter: [350, 1600],
  chimney: [450, 2200],
};
const PROP_MULT = { terraced: 0.85, semi: 1, detached: 1.35, bungalow: 1.1 };
const COVER_MULT = { tile: 1, slate: 1.28, felt: 0.9 };
const ACCESS_MULT = { standard: 1, awkward: 1.22 };

function updateCalc() {
  const [lo, hi] = BASE[calcState.job];
  const m = PROP_MULT[calcState.property] * COVER_MULT[calcState.covering] * ACCESS_MULT[calcState.access];
  const low = lo * m;
  const high = hi * m;
  const lowEl = document.getElementById("calcLow");
  const highEl = document.getElementById("calcHigh");
  animateNumber(lowEl, low);
  animateNumber(highEl, high);
}
function animateNumber(el, value) {
  const obj = { v: parseInt(el.dataset.v || "0", 10) };
  gsap.to(obj, {
    v: value, duration: 0.5, ease: "power2.out",
    onUpdate: () => { el.textContent = "£" + (Math.round(obj.v / 10) * 10).toLocaleString(); },
    onComplete: () => { el.dataset.v = value; },
  });
}
calc.querySelectorAll(".chipset").forEach((set) => {
  set.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    set.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    calcState[set.dataset.name] = chip.dataset.value;
    updateCalc();
  });
});
updateCalc();

/* ============================================================
   6. REVIEWS — render, Swiper carousel, submit (localStorage)
   ============================================================ */
const STORE_KEY = "riley_reviews_v1";
const track = document.getElementById("reviewsTrack");
let reviewSwiper;

function getReviews() {
  let extra = [];
  try { extra = JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (_) {}
  return [...extra, ...SEED_REVIEWS];
}
function starRow(n) { return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n); }
function initials(name) {
  return name.trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}
function renderReviews() {
  track.innerHTML = getReviews()
    .map(
      (r) => `
      <div class="swiper-slide">
        <div class="rev-card">
          <div class="rev-card__stars" aria-label="${r.stars} out of 5">${starRow(r.stars)}</div>
          <p class="rev-card__text">${escapeHtml(r.text)}</p>
          <div class="rev-card__meta">
            <div class="rev-card__avatar">${initials(r.name)}</div>
            <div class="rev-card__who">
              <span class="rev-card__name">${escapeHtml(r.name)}</span>
              <span class="rev-card__src">via ${escapeHtml(r.place)}</span>
            </div>
          </div>
        </div>
      </div>`
    )
    .join("");

  if (reviewSwiper) reviewSwiper.destroy(true, true);
  reviewSwiper = new Swiper(".reviews__carousel", {
    modules: [Autoplay, FreeMode],
    slidesPerView: 1.1,
    spaceBetween: 18,
    loop: true,
    freeMode: { enabled: true, momentum: false },
    speed: 6000,
    allowTouchMove: true,
    autoplay: prefersReduced ? false : { delay: 1, disableOnInteraction: false, pauseOnMouseEnter: true },
    breakpoints: {
      640: { slidesPerView: 2.1, spaceBetween: 20 },
      1024: { slidesPerView: 3.1, spaceBetween: 24 },
    },
  });
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
renderReviews();

// Review form
const reviewForm = document.getElementById("reviewForm");
const openReviewBtn = document.getElementById("openReviewForm");
const cancelReviewBtn = document.getElementById("cancelReview");
let rfStars = 5;

openReviewBtn.addEventListener("click", () => {
  reviewForm.hidden = false;
  reviewForm.scrollIntoView({ behavior: "smooth", block: "center" });
});
cancelReviewBtn.addEventListener("click", () => { reviewForm.hidden = true; });

const rfStarBtns = document.querySelectorAll("#rfStars button");
function paintStars(n) { rfStarBtns.forEach((b) => b.classList.toggle("is-on", +b.dataset.star <= n)); }
rfStarBtns.forEach((b) => {
  b.addEventListener("click", () => { rfStars = +b.dataset.star; paintStars(rfStars); });
  b.addEventListener("mouseenter", () => rfStarBtns.forEach((x) => x.classList.toggle("is-hover", +x.dataset.star <= +b.dataset.star)));
  b.addEventListener("mouseleave", () => rfStarBtns.forEach((x) => x.classList.remove("is-hover")));
});
paintStars(rfStars);

reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("rfName").value.trim();
  const place = document.getElementById("rfPlace").value.trim();
  const text = document.getElementById("rfText").value.trim();
  if (!name || !text) return;
  const review = { name, place: place || "Website", stars: rfStars, text };
  let extra = [];
  try { extra = JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (_) {}
  extra.unshift(review);
  localStorage.setItem(STORE_KEY, JSON.stringify(extra));
  reviewForm.reset();
  rfStars = 5; paintStars(5);
  reviewForm.hidden = true;
  renderReviews();
});

/* ============================================================
   7. BOOKING + CALENDAR (.ics download + Google Calendar link)
   ============================================================ */
const booking = document.getElementById("booking");
const bookingConfirm = document.getElementById("bookingConfirm");

// Default the date input to tomorrow.
const dateInput = document.getElementById("bDate");
const tomorrow = new Date(Date.now() + 864e5);
dateInput.value = tomorrow.toISOString().slice(0, 10);
dateInput.min = new Date().toISOString().slice(0, 10);

function timeWindow(label) {
  // Returns [startHour, endHour] for the chosen window.
  if (label.startsWith("Morning")) return [8, 12];
  if (label.startsWith("Afternoon")) return [12, 17];
  return [17, 19];
}
function pad(n) { return String(n).padStart(2, "0"); }
function toICSDate(d) {
  return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + "T" +
    pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + "00Z";
}
function toGCalDate(d) { return toICSDate(d); }

booking.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("bName").value.trim();
  const phone = document.getElementById("bPhone").value.trim();
  const email = document.getElementById("bEmail").value.trim();
  const service = document.getElementById("bService").value;
  const date = document.getElementById("bDate").value;
  const timeLabel = document.getElementById("bTime").value;
  const postcode = document.getElementById("bPostcode").value.trim();
  const notes = document.getElementById("bNotes").value.trim();

  if (!name || !phone || !date) {
    if (!name) document.getElementById("bName").focus();
    else if (!phone) document.getElementById("bPhone").focus();
    else dateInput.focus();
    return;
  }

  const [sh, eh] = timeWindow(timeLabel);
  const start = new Date(`${date}T${pad(sh)}:00:00`);
  const end = new Date(`${date}T${pad(eh)}:00:00`);

  const title = "Riley Roofing — Free Quote Visit";
  const details =
    `Free no-obligation roofing quote.\n\n` +
    `Name: ${name}\nPhone: ${phone}\n` +
    (email ? `Email: ${email}\n` : "") +
    `Job: ${service}\nPreferred window: ${timeLabel}\n` +
    (postcode ? `Postcode: ${postcode}\n` : "") +
    (notes ? `Notes: ${notes}\n` : "") +
    `\nRiley Roofing & Property Maintenance · 07791 995977`;
  const location = postcode ? `${postcode}` : "10 Ashford Dr, Bedworth CV12 8QJ";

  /* ---- Google Calendar link ---- */
  const gcal =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" + encodeURIComponent(title) +
    "&dates=" + toGCalDate(start) + "/" + toGCalDate(end) +
    "&details=" + encodeURIComponent(details) +
    "&location=" + encodeURIComponent(location);
  document.getElementById("gcalLink").href = gcal;

  /* ---- .ics file (Apple Calendar / Outlook) ---- */
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Riley Roofing//Booking//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:" + Date.now() + "@rileyroofing",
    "DTSTAMP:" + toICSDate(new Date()),
    "DTSTART:" + toICSDate(start),
    "DTEND:" + toICSDate(end),
    "SUMMARY:" + title,
    "DESCRIPTION:" + details.replace(/\n/g, "\\n"),
    "LOCATION:" + location.replace(/,/g, "\\,"),
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    "DESCRIPTION:Riley Roofing visit reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  document.getElementById("icsLink").href = URL.createObjectURL(blob);

  /* ---- Show confirmation ---- */
  document.getElementById("confirmName").textContent = name.split(" ")[0];
  const pretty = start.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  document.getElementById("confirmWhen").textContent = `${pretty} · ${timeLabel}`;
  bookingConfirm.hidden = false;
  bookingConfirm.scrollIntoView({ behavior: "smooth", block: "center" });
  gsap.from(bookingConfirm, { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" });
});

/* ============================================================
   8. LAZY HERO IMAGE (data-src)
   ============================================================ */
document.querySelectorAll("img.js-img[data-src]").forEach((img) => {
  const real = new Image();
  real.onload = () => { img.src = img.dataset.src; img.style.opacity = 1; };
  real.onerror = () => { img.parentElement.style.background = "linear-gradient(135deg,#161d2b,#0b0f18)"; };
  img.style.transition = "opacity 0.8s ease";
  img.style.opacity = 0;
  real.src = img.dataset.src;
});

/* ============================================================
   9. SPLITTING.JS + GSAP ENTRANCE ANIMATIONS
   ============================================================ */
if (!prefersReduced) {
  const splits = Splitting({ target: "[data-splitting]", by: "chars" });
  splits.forEach((split) => {
    gsap.from(split.chars, {
      yPercent: 115, opacity: 0, duration: 0.7, ease: "power3.out", stagger: 0.018,
      scrollTrigger: { trigger: split.el, start: "top 88%" },
    });
  });

  gsap.utils.toArray(".reveal").forEach((el) => {
    gsap.fromTo(el, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
  });

  // Hero parallax
  gsap.to(".hero__media img", {
    yPercent: 14, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
  });
} else {
  document.querySelectorAll(".reveal").forEach((el) => (el.style.opacity = 1));
}

/* ============================================================
   10. HEADER STATE, ANCHORS, MOBILE DRAWER
   ============================================================ */
const header = document.querySelector(".site-header");
ScrollTrigger.create({
  start: "top -60",
  onUpdate: (self) => header.classList.toggle("is-stuck", self.scroll() > 60),
  onRefresh: () => header.classList.toggle("is-stuck", window.scrollY > 60),
});

const drawer = document.querySelector(".drawer");
const menuToggle = document.querySelector(".menu-toggle");
function closeDrawer() {
  drawer.hidden = true;
  menuToggle.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
menuToggle.addEventListener("click", () => {
  const open = drawer.hidden;
  drawer.hidden = !open;
  menuToggle.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.style.overflow = open ? "hidden" : "";
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    const target = link.getAttribute("href");
    if (target.length > 1 && document.querySelector(target)) {
      e.preventDefault();
      closeDrawer();
      scrollToTarget(target);
    }
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

// Recalculate triggers once fonts have settled.
window.addEventListener("load", () => ScrollTrigger.refresh());
