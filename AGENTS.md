# AGENTS.md

## Overview
This is a static wedding invitation site for Tanya & Pankaj (16–17 Dec 2026, Orbit99 Club & Resort, Vadodara). It has no framework and no build step. Netlify publishes the repo root (`netlify.toml` → `publish = "."`).

## Files
- `index.html` contains all three "pages" as sibling `<section>`/`<main>` elements with `.page` and `data-page="0|1|2"`.
- `styles.css` holds the whole design system. CSS variables at the top set the palette (paper, ink, blush, rose, marigold, sage, gold) and the fonts (display, script, body).
- `app.js` handles:
  - hash routing (`#page-N` shows a page; any other in-page anchor shows its parent page and scrolls to it)
  - the envelope open animation
  - IntersectionObserver `.fade` → `.in` reveals
  - the generated calendar
  - the countdown, which targets 16 Dec 2026 11:00 IST
  - RSVP validation and AJAX submission
- `thank-you.html` is the no-JS fallback for the form's `action`.
- `tanya-pankaj-wedding.ics` is the calendar download, with CRLF line endings.
- `img/` holds the generated watercolour PNGs: couple, venue, florals, story, locket.

## Conventions and decisions
- **Images** are always referenced through Netlify Image CDN (`/.netlify/images?url=/img/<file>&w=<w>&fm=webp`), never directly. They have cream paper backgrounds and use `mix-blend-mode: multiply` to blend into the page.
- **The RSVP uses Netlify Forms** (`name="rsvp"`, honeypot `bot-field`), even though the original request mentioned Wix Forms. Wix Forms only works on Wix-hosted sites. The static form in `index.html` is detected at deploy time. JS posts URL-encoded data to `/`, and the multi-select `days` values are joined into one string.
  - If you add or rename fields, keep the names in the HTML form, because Netlify validates fields against the deployed form.
  - Form detection is enabled through the marker in `.netlify/features/netlify-forms`.
- Schedule times, dress codes, the RSVP-by date and the hashtag are sensible placeholders that the couple can edit directly in `index.html`.
- Respect `prefers-reduced-motion`. Animate only transform and opacity.
