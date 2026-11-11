# Tanya & Pankaj — Wedding Website

An invitation-style wedding website for Tanya and Pankaj's celebrations on **16–17 December 2026** at **Orbit99 Club & Resort, near Kaka Farm, Vadodara, Gujarat**.

Guests move through three "pages", like opening a real invitation:

1. **Envelope** (`#page-0`) — a blush envelope with a wax seal; tapping it opens the letter.
2. **Invitation** (`#page-1`) — an arched hero illustration, a December calendar with the dates circled and a calendar download, a heartfelt note, a live countdown, venue details and directions, and a link to RSVP.
3. **RSVP** (`#page-2`) — name, mobile number, attendance, celebration days, guest count, and a personal note.

## Technologies

- Plain HTML, CSS and vanilla JavaScript, with no build step
- **Netlify Forms** for RSVP collection (spam filtering, dashboard, CSV export, email notifications)
- **Netlify Image CDN** to serve the illustrations as resized WebP
- Watercolour illustrations generated with Gemini through Netlify AI Gateway (stored in `img/`)
- Google Fonts: Allura, Cormorant Garamond, Jost

## Running locally

```bash
netlify dev --port 8889
```

Then open the printed local URL. Use `netlify dev` rather than a plain static server so the `/.netlify/images` URLs resolve.

## Viewing RSVPs

In the Netlify dashboard, open **Forms → rsvp** to see the submissions. You can download them as CSV or set up email notifications under **Forms → Form notifications**.

## Things to personalise

- The personal note and venue copy in `index.html`
- The colour palette and typography in `styles.css`
- Replace the illustrations with real couple photos by dropping files into `img/` and updating the `url=` values
