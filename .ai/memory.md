# SHERO COSMETIC — Project Memory

**Last updated:** 2026-05-17
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

## Current status — 2026-05-17 (paused awaiting owner)

The session paused with R1 of the visual-identity redesign **live on
staging** and a pending question about which redesign batch to do next.
The user paused to restart their application; next session resumes here.

### What's done
- Phases 0, 1, 3 (UI/UX pass — Batches 1–4), 5 (staging), and
  redesign R1 (B&W tokens + dark mode + Manrope) — all committed
  and pushed.
- Latest commit on `main` is the R1 commit `7d6b26d`.

### Live URLs
- **Staging (with R1 redesign):**
  https://wecooked01-sketch.github.io/shero-cosmetic/
  (noindex / Disallow — see ADR-0009)
- **GitHub repo:** https://github.com/wecooked01-sketch/shero-cosmetic

### Pending question (owner to answer next session)

"Which redesign batch next?"

| Option | Status | Estimate |
|---|---|---|
| **R2** — Redraw the 3 product bottle SVGs as monochrome line-art | Recommended | 2–4 hr |
| R3 — Animation rework (mask reveals, magnetic CTAs, cursor-follow, sticky scrub) | | 3–6 hr |
| R4 — Section-level UI/UX polish (hero composition, quiz card, press marquee cleanup) | | 2–4 hr |
| Pause to review R1 first | | — |

Owner dismissed the question to restart their application. Re-ask
politely on next session unless they bring it up themselves.

### Known intermediate state to watch for
- **Bottle SVGs still embed rose-gold + blush gradient defs** in
  `index.html`. Visible mismatch in light mode, jarring in dark mode.
  This is R2 work — do NOT touch in R3 or R4 without confirming.
- Bg-text "SHERO COSMETIC" hero wordmark gradient is now neutral
  but very subtle — intentional, but check if owner wants more
  visible.
- The `.product-glow` radial gradient is now dark-on-cream which
  reads as a shadow rather than a glow. Will resolve in R2 with
  the bottle redraw.
- Compat-aliased tokens (`--rose-gold → --ink`, etc.) work but are
  semantically confusing in source. Cleanup pass planned but not
  prioritized.

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
