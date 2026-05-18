# SHERO COSMETIC — Project Memory

**Last updated:** 2026-05-18
**Owner:** wickedbro (wecooked01@gmail.com)
**Location:** `/Users/wickedbro/Desktop/Tasarım/SHERO COSMETIC/Website`

## What this is

A static product-display brand landing for SHERO Cosmetic, a skincare brand
based in Istanbul. **Not a storefront** — sales happen on a separate channel
(Shopify, Amazon, retail partners, etc., TBD). CTAs on this site link out
with UTM tags.

## Scope decision (from onboarding session, 2026-05-17)

The user originally said "real brand launching for sale," which suggested a
full ecommerce build. They clarified: this specific site is **product
display only**, not the shop. That moved the whole project from "build a
storefront" to "polish a brand landing and wire real-world infra."

External store URL is **not yet provided** — placeholder for now.

## Current stack

Vanilla HTML + CSS + JS. **GSAP is now removed** — `IntersectionObserver`
handles reveal-on-scroll. Google Fonts: Bagel Fat One (display) +
Manrope (heading/body). Python `http.server` for dev. No framework, no
bundler, no `package.json`. See `CLAUDE.md` for full stack snapshot.

## What was already built when I took over

- Hero slider (3 slides, hand-drawn SVG product bottles, autoplay + observer pause)
- Press marquee bar
- About section with stats and decorative SVG
- Ingredients grid (4 cards: Vit C, HA, Retinol, Niacinamide)
- 3-step skin quiz with concern-based product picks → result card
- "Build my routine" 5-step ladder
- Testimonials carousel (4 reviews, Turkish names — DTC voice)
- Contact form (client-side only, no backend wired)
- Footer with newsletter form (client-side only, no backend wired)
- Mobile nav drawer with backdrop, Escape-to-close, focus lock
- GSAP reveal animations with the `immediateRender:false + once:true` pattern

Bugs found during onboarding:
1. `script.js:255` — `querySelector(':scope::after')` is invalid; harmless
   dead code from iteration. Fixed in Phase 0.
2. Several `getElementById` calls on top-level module that throw if the ID
   is missing. All IDs currently exist; added optional-chaining for safety.
3. GSAP CDN scripts had no SRI integrity hashes. Fixed in Phase 0.

## Current status — 2026-05-18 (warm rewrite + real assets + Turkish copy shipped)

Owner reviewed the apothecary B&W build (R1+R2+R3+R4) and pivoted to a
warm + decorative + photography-led aesthetic. The whole site was
rewritten from scratch in four blocks across this session, then real
photography, real contacts, and Turkish copy were dropped in afterwards.
ADR-0011 supersedes ADR-0010 with the rationale.

### What's done (warm rewrite)
- **Foundation** (`77a0c02`) — warm cream / sand / orange-accent tokens,
  Bagel Fat One display font, Manrope heading/body, primitives
  (container, section, surface-card, btn, btn-play, chip, pill,
  trust-row, decor slots). Header pill, full hero, trust row, stubs
  for everything else.
- **Block 2** (`630091d`) — press marquee + about (two-col with quote
  card overlay + 4-stat row) + ingredients (4-up white cards with
  accent-soft icons on sand bg). Leaf decoration removed from hero per
  owner request, bloom kept.
- **Block 3** (`5b39042`) — full product grid (new: 6 SKUs in 3×2 grid
  with chip filters), lab/clinical results (new: two-col with cert
  pills + three result cards, one inverted to ink), skin quiz rewritten
  with the new aesthetic + accent progress bar + accent-soft selected
  state.
- **Block 4** (`57c66ac`) — routine 5-step (feature step 03 inverted
  to ink), testimonials 3-up grid (middle inverted to ink), contact
  (split with info list + form on sand bg), full footer (4-col brand /
  shop / story / newsletter + bottom legal row), mobile nav drawer
  rebuilt for the new aesthetic.

### What's done (post-rewrite, same session)
- **Legal drafts** (`418cb1a`) — five `noindex` legal pages shipped at
  the root: `privacy.html`, `terms.html`, `cookies.html`, `shipping.html`,
  `accessibility.html`. Each has a prominent "DRAFT" banner and
  cross-page footer nav. Footer in `index.html` wired to them. ADR-0012
  records the noindex-draft strategy + the review gate before flipping
  to `index, follow`.
- **Real asset integration** (`77055c4`) — owner-supplied JPEG photography
  dropped into the `data-asset` slots: hero collection (`hero-collection.jpg`),
  hero product cutout (`hero-product-gunduz.jpg`), about atelier
  (`about-atelier.jpg`), plus all six product card images under
  `assets/photos/product-*.jpg`. Site copy fully swapped to **Turkish**
  (`<html lang="tr">`, meta description, OG/Twitter, JSON-LD,
  every section). `data/products.json` updated with Turkish names + the
  real SKU lineup (Gece Serum & Maske, Asit Maske, Vitamin Bomb, Gündüz
  Serum, Siyah Karbon Maske, Foundation). PETA / BUAV / no-animal-test
  badges added under `badges/`. `script.js` quiz output rewritten for
  the new product set.
- **Real contacts + brand story** (`2def5b5`) — real email, phone, and
  Karaköy address wired through markup + JSON-LD. Real social handles
  (Instagram, Twitter, LinkedIn, Facebook) replace placeholders. Brand
  story copy rewritten with the founder voice the owner provided.
- **Wordmark PNG** (`870c0d3`) — `shero-black.png` + `shero-white.png`
  wired into header, footer, and mobile nav as the brand wordmark.
  Bagel Fat One text wordmark replaced where it appeared at logo scale.
- **Typography rewrite — Fraunces + Manrope** (uncommitted at session
  resume) — Bagel Fat One fully removed (index.html + all 5 legal
  pages). Display tier is now Fraunces variable serif (opsz axis, 144
  for hero, 96 for sections, weight 500). All five `<span class="display">`
  swapped to `<em>` (italic, same family, ink-soft color) — one family
  per headline rule. `.display` class deleted from CSS. Manrope retains
  weight 800 for h3 card titles + stat numbers + eyebrows (18 rules).
  ADR-0013 records the decision; CLAUDE.md updated.

### Live URLs
- **Staging (with R1 + R2 redesign):**
  https://wecooked01-sketch.github.io/shero-cosmetic/
  (noindex / Disallow — see ADR-0009)
- **GitHub repo:** https://github.com/wecooked01-sketch/shero-cosmetic

### Pending question (owner to answer next session)

"What's next now that real photos, Turkish copy, and contacts are live?"

| Option | Status | Estimate |
|---|---|---|
| Legal counsel review of the five draft pages (privacy/terms/cookies/shipping/accessibility) — see ADR-0012 review gate | Owner-blocked | external |
| Phase 2 — Real integrations (Klaviyo / Formspree / CF Analytics / UTM-tagged outbound) | Blocked on store URL + accounts | 2–4 hr |
| Production migration (Cloudflare Pages + custom domain) | Blocked on DNS + account | 30 min once unblocked |
| Bloom decoration PNG (only remaining `data-asset` not filled — currently inline SVG petals) | Optional / owner call | 5 min swap |
| Backlog polish — fix misleading "Hover each card" routine copy on touch | Unblocked | 10 min |

### Known state to watch for
- The current visual system is the warm + decorative one from ADR-0011.
  Apothecary B&W (ADR-0010) is retired; do not mix its tokens or fonts
  into new work. If reverting, start from the R3 commit `b1c9e96`.
- **Typography rule (ADR-0013):** within a single `<h1>` or `<h2>`,
  only ONE family. Emphasis is `<em>` (italic, same family), NEVER
  a `<span>` swapping to a different font. `.hero__title` and
  `.section-title` resolve to Fraunces; everything else (h3 cards,
  eyebrows, body, micro UI) is Manrope. Don't reintroduce Bagel Fat
  One — superseded.
- Site is **Turkish-first** since `77055c4`. `<html lang="tr">`, all
  copy in Turkish, JSON-LD address in Karaköy/Istanbul. Don't accidentally
  drop English copy back in. A future EN/TR toggle is in the backlog.
- The `data-asset` slots are now mostly **filled with real `<img>` tags**
  pointing at `assets/photos/*.jpg` (hero-collection, hero-product-gunduz,
  about-atelier, product-{gece-serum-maske, asit-maske, vitamin-bomb,
  gunduz-serum, siyah-karbon-maske, foundation}). The slot wrappers
  and `data-asset` attributes are still on the parent `<div>`s — keep
  them; they're useful selectors and the bloom decoration still needs
  a PNG drop-in. Don't strip them as "dead" markup.
- The bloom decoration (`decor--bloom-right`) is still an inline SVG
  with `<ellipse>` petals — owner hasn't supplied a PNG cutout for it.
  Acceptable as-is; only swap if a real asset arrives.
- Real contacts in markup + JSON-LD: `hello@sherocosmetic.com`,
  `+90-850-220-2088`, Karaköy/Istanbul. If these change, update both
  `index.html` Organization JSON-LD (`@id` block) AND the visible
  contact section AND the footer. Three sources of truth — keep synced.
- Real socials are wired: instagram.com/sherocosmetic, twitter.com,
  facebook.com, linkedin.com/company/sherocosmetic. Update `sameAs[]`
  in JSON-LD if any change.
- Wordmark is now `shero-black.png` (light theme) / `shero-white.png`
  (dark theme) — see header, footer, mobile nav. If editing the
  wordmark display, swap the PNGs rather than re-introducing Bagel Fat
  One text-as-logo.
- The leaf decoration was explicitly REMOVED from the hero per owner
  request. Don't re-add unless asked. The bloom (flower) decoration
  remains in the hero bottom-right.
- `--rose-gold-text` resolves to `--ink` since contrast in B&W is
  automatic. Variable still exists for compat.
- The `.product-glow` div is in DOM (animateSlideIn still targets
  it) but visibility:hidden + 0×0 so it has no paint. Don't
  remove from HTML — would break the GSAP animation timeline.
- R4 swapped the hero bg-text from hardcoded rgba gradient to
  `color: var(--ink)` + `opacity: .08 / .055` so it theme-adapts.
- Hardcoded `rgba(0,0,0,.12)` on `.bottle` drop-shadow is
  intentional — in dark mode it's near-invisible, which matches
  the apothecary-flat aesthetic. Don't "fix" without confirming.
- Search icon hidden on mobile (`<= 820px`) because it's
  non-functional and the new theme toggle needed the row space.
  Re-show when search is wired up.
- The `.slide__title br + *` selector was a silent no-op for
  months (a `<br>` is followed by a text node, not an element).
  R4 wrapped each slide title's second word in a `<span>` so the
  italic + ink-soft typographic contrast actually applies. If
  you add new slides, keep that pattern: `Title<br/><span>Word</span>`.
- The headless preview server has two real quirks worth knowing:
  (a) `window.innerWidth`/`Height` may be `0` during initial script
  execution before resize; (b) `requestAnimationFrame` doesn't tick
  reliably so any rAF-driven animations stall. The current build
  doesn't depend on rAF (IntersectionObserver-driven reveals only),
  so this matters less than it did under R3. Verification via
  `preview_inspect` (CSS values) is more reliable than screenshots.
- To force-reveal all `[data-reveal]` elements for a clean screenshot:
  `document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-revealed'))`.

### Two upstream blockers from earlier (still pending)
1. **External store URL** for Phase 2 integrations + CTA UTM hooks.
   All forward CTAs already carry `data-cta` attributes per ADR-0007;
   waiting on the destination URL.
2. **Production domain DNS** for `sherocosmetic.com` to point at a
   real deploy. Until that happens, the staging URL stays in noindex
   mode. ADR-0009 has the full 5-step migration.

### Phases not yet started
- Phase 2 — Real integrations (Klaviyo, Formspree, Cloudflare Web
  Analytics, UTM rewriter helper). Blocked on accounts + store URL.
- Phase 4 — Legal pages (privacy, terms, cookie info). Can happen
  in parallel.

## Phase tracker

See `milestones.md`. The redesign batches (R1–R4) live there under
"Phase R — Visual identity redesign".

## How to resume

1. Read this file.
2. Read `milestones.md` to see what phase we're in.
3. Read `backlog.md` for anything queued.
4. Read `docs/decisions/README.md` for the index of ADRs.
5. Continue from the "in progress" phase.
