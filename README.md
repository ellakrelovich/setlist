# Setlist

Setlist is a booking platform prototype connecting independent artists and
bands with local venues. Built as a class project / functional prototype
from the Setlist Figma design.

## Tech

Plain HTML, CSS and vanilla JavaScript (ES modules) — no build step, no
framework, no backend. Chosen so the site needs zero dependencies and
deploys to GitHub Pages with nothing more than a checkout.

- **Routing:** a tiny hash-based router (`src/lib/router.js`). Hash routes
  (`#/talent`, `#/artist/:id`, …) avoid any GitHub Pages sub-path / 404
  configuration entirely, since every URL resolves to the same
  `index.html` and the router reads `location.hash` client-side.
- **Data:** a single mock data store (`src/data/store.js`) backed by
  `localStorage`, seeded with sample artists, venues, reviews and demo
  accounts (`src/data/seed.js`). New artists/venues created through the
  app are written to the same store that search reads from.
- **Styling:** one design-system stylesheet (`src/styles.css`) — dark,
  high-contrast, red-accented, Anton display type + Inter body type,
  matching the Figma visual identity — with responsive breakpoints for
  desktop, tablet and mobile.

## Local development

No install required. Serve the folder with any static file server, e.g.:

```
npx serve .
# or
python3 -m http.server 8080
```

Then open the printed local URL.

## Demo accounts

| Email            | Password | Type   |
| ---------------- | -------- | ------ |
| artist@demo.com  | password | Artist |
| venue@demo.com   | password | Venue  |

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which publishes
the repository as-is to GitHub Pages (Settings → Pages → Source: GitHub
Actions). Because there is no bundler, there's no `base` path to
configure — all asset references are relative and routing is hash-based,
so the site works correctly whether it's served from `/` or from a
repository sub-path such as `/setlist/`.

## Image assets

The Figma design's photography could not be downloaded into this
environment, so artist/venue imagery throughout the app uses simple,
on-brand placeholder tiles (dark gradient + icon) sized to the same
aspect ratio as the design. Swap in real photos by replacing the
`.thumb`, `.photo` and `.image-block` placeholders in `src/components/`
and `src/pages/` once real assets are available.
