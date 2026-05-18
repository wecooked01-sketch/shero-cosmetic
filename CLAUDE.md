# SHERO COSMETIC — Brand Landing Site

A static product-display landing for the SHERO Cosmetic skincare brand. Not a
storefront — CTAs link out (with UTM tags) to whatever external commerce
channel the brand uses (Shopify, Amazon, retail partners, etc.).

## Stack

| Layer | Tech |
|---|---|
| Markup | Static page per locale: `index.html` (TR, default) + `en/index.html` (EN). See [ADR-0014](docs/decisions/0014-bilingual-tr-default-en-static-duplication.md). |
| Styles | Plain CSS with custom properties (`styles.css`) |
| Behavior | Vanilla JS (`script.js`). GSAP is dropped; IntersectionObserver handles reveals. Quiz strings are read from `window.QUIZ_I18N` (defined inline per page) so the same script.js drives both locales. |
| Fonts | Fraunces (variable serif, opsz + italic, display only) + Manrope 400-800 (UI/body, 800 for h3 cards + stat numbers) — Google Fonts. See [ADR-0013](docs/decisions/0013-typography-fraunces-manrope.md). |
| Hosting | GitHub Pages (staging, live) → Cloudflare Pages (production, planned). See [ADR-0009](docs/decisions/0009-github-pages-staging-then-cloudflare-pages.md). |
| Dev server | `python3 -m http.server 5173` (see `.claude/launch.json`) |

No framework, no bundler, no `package.json`. Keep it that way unless there's a
concrete reason to change.

## Project files

```
index.html       — TR landing (default locale, /, `<html lang="tr">`)
en/index.html    — EN landing (/en/, `<html lang="en">`). Uses ../ asset paths.
                   Both pages must stay structurally in sync; copy changes
                   land in both. See ADR-0014.
styles.css       — all styling, palette as CSS custom properties
script.js        — theme toggle, smooth scroll, IO-based reveals, quiz logic.
                   Reads quiz strings from `window.QUIZ_I18N` (defined inline
                   per page). TR is hard-coded as a fallback.
data/
  products.json  — canonical product list (TR display labels; also embedded
                   inline in both index.html and en/index.html for runtime
                   use — keep all three in sync until a build step is added)
.ai/             — session memory (memory.md is the entry point)
docs/decisions/  — architecture decision records (start with README.md)
```

## Brand context

- Based in Istanbul (Turkey)
- Target market: Turkish + general European audiences. Site is bilingual: TR at `/` (default), EN at `/en/`. Header + mobile-nav have a JS-free TR/EN switcher. See [ADR-0014](docs/decisions/0014-bilingual-tr-default-en-static-duplication.md). The five legal pages stay TR-only until counsel signs off on the drafts ([ADR-0012](docs/decisions/0012-legal-pages-as-noindex-drafts.md)).
- Tone: clean, science-backed, warmly editorial — never gimmicky
- Positioning: warm + decorative + photography-led (current). See [ADR-0011](docs/decisions/0011-visual-identity-warm-decorative-photography.md). The earlier apothecary B&W direction is documented in [ADR-0010](docs/decisions/0010-visual-identity-apothecary-bw-manrope.md) (superseded).
- Visual palette: warm cream (#F4F0E8) / warm sand alt (#ECE3D2) / near-black ink (#1A1814) / orange accent (#E2592A). Dark mode is a warm charcoal variant, not pure black.
- Typography: Fraunces variable serif for the hero title + section titles (`.hero__title`, `.section-title`) only. Manrope for everything else (h3 card titles, eyebrows, buttons, body, micro UI). Within one headline: ONE family — variation via weight + italic, never a mid-headline family swap. Emphasis word in a title is marked with `<em>`. See [ADR-0013](docs/decisions/0013-typography-fraunces-manrope.md).
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
