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

Vanilla HTML + CSS + JS, with GSAP 3.12 + ScrollTrigger for animation.
Google Fonts. Python `http.server` for dev. No framework, no bundler, no
`package.json`. See `CLAUDE.md` for full stack snapshot.

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

## Current status — 2026-05-18 (R1+R2+R3+R4 all live)

Phase R — the full visual identity redesign — is complete. R3 lands
the animation rework; R4 landed the section-level polish; both went
live on staging in the same session. The whole apothecary pass is
now in production-ready state pending the upstream blockers (store
URL + DNS) tracked below.

### What's done
- Phases 0, 1, 3 (UI/UX pass — Batches 1–4), 5 (staging), redesign
  R1 (B&W tokens + dark mode + Manrope), R2 (bottle + leaf SVGs
  to line-art), R4 (section-level apothecary polish), and R3
  (mask reveals + magnetic CTAs + hero cursor-follow + routine
  sticky scrub) — all committed.
- Pre-R3 commit: `54ee871` (R4). R3 commit lands this session.

### Live URLs
- **Staging (with R1 + R2 redesign):**
  https://wecooked01-sketch.github.io/shero-cosmetic/
  (noindex / Disallow — see ADR-0009)
- **GitHub repo:** https://github.com/wecooked01-sketch/shero-cosmetic

### Pending question (owner to answer next session)

"What's next now that Phase R is done?"

| Option | Status | Estimate |
|---|---|---|
| Phase 4 — Legal pages (privacy/terms/KVKK/cookie) | Unblocked | 2–4 hr |
| Phase 2 — Real integrations (Klaviyo / Formspree / CF Analytics / UTM-tagged outbound) | Blocked on store URL + accounts | 2–4 hr |
| Production migration (Cloudflare Pages + custom domain) | Blocked on DNS + account | 30 min once unblocked |
| Backlog cleanup — token renaming (`--rose-gold` → neutrals), favicons, Lighthouse run | Source-readability + polish | 1–3 hr |

### Known state to watch for
- R1+R2+R4 visuals coherent in both light and dark mode. Verified
  in preview at desktop (1440×900) and mobile (375×812). Dark mode
  hero verified end-to-end via screenshot.
- The `--rose-gold`, `--blush`, `--cream` etc. tokens are now
  backward-compat aliases pointing at the neutral tokens. Existing
  selectors keep working. Cleanup pass to rename properly is in
  backlog but NOT prioritized — it's source-readability only.
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
- The headless preview server has a quirk: GSAP's RAF loop does
  not tick reliably, so slide entry animations stall at
  `autoAlpha: 0`. Real browsers are fine. To screenshot for
  verification, snap manually first:
  `document.querySelectorAll('.slide *').forEach(el => { el.style.opacity = '1'; el.style.visibility = 'visible'; el.style.transform = 'none'; })`
  This is a preview-tooling quirk, NOT a regression in the site.
- R3 sticky scrub uses `gsap.matchMedia` so it's reactive on
  resize. ScrollTrigger pin uses `+=140%` of viewport — section
  pins for ~1.4× viewport-height of scroll. The `pin-spacer`
  div ScrollTrigger inserts is what makes the page taller. Don't
  worry if the page's total scroll height jumps after R3 — that's
  the pin spacer doing its job.
- Magnetic CTAs use raw GSAP `x`/`y` translates. Don't combine
  with CSS `transform: translateY(...)` on the same buttons —
  GSAP would clobber it. Use `gsap.set` if you need to add a
  baseline transform.

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
