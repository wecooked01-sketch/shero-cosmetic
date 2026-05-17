# SHERO COSMETIC — Brand Landing Site

A static product-display landing for the SHERO Cosmetic skincare brand. Not a
storefront — CTAs link out (with UTM tags) to whatever external commerce
channel the brand uses (Shopify, Amazon, retail partners, etc.).

## Stack

| Layer | Tech |
|---|---|
| Markup | Single static `index.html` |
| Styles | Plain CSS with custom properties (`styles.css`) |
| Behavior | Vanilla JS (`script.js`). GSAP is dropped; IntersectionObserver handles reveals. |
| Fonts | Bagel Fat One (display) + Manrope 400-800 (heading/body) — Google Fonts |
| Hosting | GitHub Pages (staging, live) → Cloudflare Pages (production, planned). See [ADR-0009](docs/decisions/0009-github-pages-staging-then-cloudflare-pages.md). |
| Dev server | `python3 -m http.server 5173` (see `.claude/launch.json`) |

No framework, no bundler, no `package.json`. Keep it that way unless there's a
concrete reason to change.

## Project files

```
index.html       — single-page markup
styles.css       — all styling, palette as CSS custom properties
script.js        — theme toggle, smooth scroll, IO-based reveals, section logic
data/
  products.json  — canonical product list (also embedded in index.html for
                   runtime use — keep both in sync until a build step is added)
.ai/             — session memory (memory.md is the entry point)
docs/decisions/  — architecture decision records (start with README.md)
```

## Brand context

- Based in Istanbul (Turkey)
- Target market: Turkish + general European audiences
- Tone: clean, science-backed, warmly editorial — never gimmicky
- Positioning: warm + decorative + photography-led (current). See [ADR-0011](docs/decisions/0011-visual-identity-warm-decorative-photography.md). The earlier apothecary B&W direction is documented in [ADR-0010](docs/decisions/0010-visual-identity-apothecary-bw-manrope.md) (superseded).
- Visual palette: warm cream (#F4F0E8) / warm sand alt (#ECE3D2) / near-black ink (#1A1814) / orange accent (#E2592A). Dark mode is a warm charcoal variant, not pure black.
- Typography: Bagel Fat One (display, used sparingly for the wordmark + decorative moments) + Manrope (heading 800 / body 400-500)
- Photography-dependent: many sections expect product / model / botanical imagery the owner is supplying. Markup uses `data-asset="..."` slots until real assets arrive.

## What this site is NOT

- It is not a checkout. Don't add cart UI or product detail pages with prices
  unless the scope changes (record an ADR if it does).
- It is not a CMS. Content is hand-edited in HTML.
- It is not a blog. (Could become one — see `.ai/backlog.md`.)

## Decision Log

See [docs/decisions/README.md](docs/decisions/README.md) for all architectural
decisions. Check this before making significant modifications.

## Continuing work

For session resume context, read `.ai/memory.md` first.
