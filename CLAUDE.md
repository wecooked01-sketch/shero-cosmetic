# SHERO COSMETIC — Brand Landing Site

A static product-display landing for the SHERO Cosmetic skincare brand. Not a
storefront — CTAs link out (with UTM tags) to whatever external commerce
channel the brand uses (Shopify, Amazon, retail partners, etc.).

## Stack

| Layer | Tech |
|---|---|
| Markup | Single static `index.html` |
| Styles | Plain CSS with custom properties (`styles.css`) |
| Behavior | Vanilla JS + GSAP 3.12 + ScrollTrigger (`script.js`) |
| Fonts | Playfair Display + Outfit (Google Fonts) |
| Hosting | GitHub Pages (staging, live) → Cloudflare Pages (production, planned). See [ADR-0009](docs/decisions/0009-github-pages-staging-then-cloudflare-pages.md). |
| Dev server | `python3 -m http.server 5173` (see `.claude/launch.json`) |

No framework, no bundler, no `package.json`. Keep it that way unless there's a
concrete reason to change.

## Project files

```
index.html       — single-page markup
styles.css       — all styling, palette as CSS custom properties
script.js        — slider, quiz, reveal animations, mobile nav, testimonials
data/
  products.json  — canonical product list (also embedded in index.html for
                   runtime use — keep both in sync until a build step is added)
.ai/             — session memory (memory.md is the entry point)
docs/decisions/  — architecture decision records (start with README.md)
```

## Brand context

- Based in Istanbul (Turkey)
- Target market: Turkish + general European audiences
- Tone: clean, science-backed, quietly luxurious — never gimmicky
- Visual palette: warm cream, blush, rose-gold, deep brown
- Typography: Playfair Display (serif, italic for `<em>`) + Outfit (sans)

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
