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

## Current status — 2026-05-18 (full rewrite shipped)

Owner reviewed the apothecary B&W build (R1+R2+R3+R4) and pivoted to a
warm + decorative + photography-led aesthetic. The whole site was
rewritten from scratch in four blocks across this session. ADR-0011
supersedes ADR-0010 with the rationale.

### What's done (latest rewrite)
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
- **Block 4** (this commit) — routine 5-step (feature step 03 inverted
  to ink), testimonials 3-up grid (middle inverted to ink), contact
  (split with info list + form on sand bg), full footer (4-col brand /
  shop / story / newsletter + bottom legal row), mobile nav drawer
  rebuilt for the new aesthetic.

### Live URLs
- **Staging (with R1 + R2 redesign):**
  https://wecooked01-sketch.github.io/shero-cosmetic/
  (noindex / Disallow — see ADR-0009)
- **GitHub repo:** https://github.com/wecooked01-sketch/shero-cosmetic

### Pending question (owner to answer next session)

"What's next now that legal drafts are shipped?"

| Option | Status | Estimate |
|---|---|---|
| Legal counsel review of the five draft pages (privacy/terms/cookies/shipping/accessibility) — see ADR-0012 review gate | Owner-blocked | external |
| Drop in real photography + decoration PNGs the owner is producing | Owner-blocked | swap into `data-asset` slots, ~30 min once received |
| Phase 2 — Real integrations (Klaviyo / Formspree / CF Analytics / UTM-tagged outbound) | Blocked on store URL + accounts | 2–4 hr |
| Production migration (Cloudflare Pages + custom domain) | Blocked on DNS + account | 30 min once unblocked |

### Known state to watch for
- The current visual system is the warm + decorative one from ADR-0011.
  Apothecary B&W (ADR-0010) is retired; do not mix its tokens or fonts
  into new work. If reverting, start from the R3 commit `b1c9e96`.
- All photography slots use `data-asset="..."` attributes (hero-main,
  hero-product-cutout, decor-bloom, about-atelier, product-{id},
  etc.). Replace the placeholder `<span>` with `<img src="..." alt="">`
  when assets arrive.
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
