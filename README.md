# Riley Roofing &amp; Property Maintenance

Marketing website for **Riley Roofing &amp; Property Maintenance** — a local, family-run roofer based in Bedworth, covering a 50-mile radius of Warwickshire (Nuneaton, Coventry, Hinckley, Rugby, Leamington).

Built as a fast, mobile-first single-page site with a dark **Midnight &amp; Amber** visual direction — deliberately not templated.

## Features

- **Cinematic hero** with parallax and animated headline
- **Categorised services** — Roofing · Repairs &amp; Storm Damage · Guttering &amp; Finishings · Property Maintenance
- **Recent work gallery** (links out to the live Facebook page)
- **Free estimate calculator** — instant guide price from four quick taps
- **Reviews** — moving carousel seeded with real Google reviews, plus a leave-a-review form
- **Appointment booking** — generates a Google Calendar link and a downloadable `.ics` (Apple / Outlook)
- **Prominent contact** — tap-to-call throughout, plus a sticky mobile call bar

## Tech

- [Vite](https://vitejs.dev/) — build tooling
- [Lenis](https://github.com/darkroomengineering/lenis) — smooth scroll, synced to the GSAP ticker
- [GSAP](https://gsap.com/) + ScrollTrigger — animation
- [Splitting.js](https://splitting.js.org/) — character-split heading animations
- [Swiper](https://swiperjs.com/) — reviews carousel

## Getting started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
npm run build    # production build to dist/
npm run preview  # preview the production build
```

## Notes

- Gallery images are placeholders (Unsplash). Swap in Riley Roofing's own job photos for production.
- Reviews and bookings are client-side for the demo (localStorage / calendar files). Production would wire these to a backend or a service such as Formspree / Calendly.

---

**Riley Roofing &amp; Property Maintenance** · 07791 995977 · 10 Ashford Dr, Bedworth CV12 8QJ · [Facebook](https://www.facebook.com/Rileyroofing/?locale=en_GB)
