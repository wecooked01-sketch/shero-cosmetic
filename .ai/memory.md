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

## Current status — 2026-05-17 (paused awaiting owner, NEW CHAT incoming)

The owner is starting a fresh chat to continue. R1 + R2 of the
visual-identity redesign are **both live on staging**; R3 and R4
are still queued. The next session resumes from the R3-vs-R4-vs-pause
decision.

### What's done
- Phases 0, 1, 3 (UI/UX pass — Batches 1–4), 5 (staging), redesign
  R1 (B&W tokens + dark mode + Manrope), and redesign R2 (bottle
  + leaf SVGs to line-art) — all committed and pushed.
- Latest commit on `main` is the R2 commit `8064ea3`.

### Live URLs
- **Staging (with R1 + R2 redesign):**
  https://wecooked01-sketch.github.io/shero-cosmetic/
  (noindex / Disallow — see ADR-0009)
- **GitHub repo:** https://github.com/wecooked01-sketch/shero-cosmetic

### Pending question (owner to answer next session)

"Which redesign batch next?"

| Option | Status | Estimate |
|---|---|---|
| R3 — Animation rework (mask reveals, magnetic CTAs, cursor-follow on hero, sticky scrub on routine 5-step) | Bigger, more dramatic | 3–6 hr |
| R4 — Section-level polish (hero composition rethink, quiz card treatment, press marquee variant cleanup, footer/newsletter) | Smaller, more bounded | 2–4 hr |
| Pause to review R1+R2 live first | | — |

The owner asked us to wait (literal words: "wait here remember where
we left. I will start a new chat to continue this project"). Re-ask
the R3-vs-R4 question politely on next session unless they bring up
something different.

### Known state to watch for
- R1 + R2 visuals coherent in both light and dark mode. Verified
  in preview at desktop and mobile (375×812 and ~360 narrow).
- The `--rose-gold`, `--blush`, `--cream` etc. tokens are now
  backward-compat aliases pointing at the neutral tokens. Existing
  selectors keep working. Cleanup pass to rename properly is in
  backlog but NOT prioritized — it's source-readability only.
- `--rose-gold-text` resolves to `--ink` since contrast in B&W is
  automatic. Variable still exists for compat.
- The `.product-glow` div is in DOM (animateSlideIn still targets
  it) but visibility:hidden + 0×0 so it has no paint. Don't
  remove from HTML — would break the GSAP animation timeline.
- The hero's big bg-text "SHERO COSMETIC" wordmark uses rgba(22,
  22, 20, low-alpha) — visible in light, very subtle in dark.
  Owner hasn't complained but if they want it more visible in
  dark, use a theme-aware token instead.
- Hardcoded `rgba(0,0,0,.12)` on `.bottle` drop-shadow is
  intentional — in dark mode it's near-invisible, which matches
  the apothecary-flat aesthetic. Don't "fix" without confirming.
- Search icon hidden on mobile (`<= 820px`) because it's
  non-functional and the new theme toggle needed the row space.
  Re-show when search is wired up.

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
