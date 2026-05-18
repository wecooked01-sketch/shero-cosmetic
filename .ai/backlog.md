# Backlog

Items deferred from the current phase, ordered roughly by value.

## Soon

- **External store URL** — required for Phase 2 UTM tagging. Currently blocked
  on a business decision (which channel sells: own Shopify, Amazon, retail).
  CTAs are already marked with `data-cta` + `data-cta-campaign` +
  `data-cta-content` attributes (per ADR-0007); when the store URL is known,
  a tiny `script.js` helper will rewrite the `href` on every `[data-cta]`
  anchor to the UTM-tagged destination. Until then, CTAs anchor to in-page
  sections.
- **Lighthouse measurement** — needs a deployed URL (Phase 5). Target ≥95
  across all four metrics.
- **Manual keyboard-traversal audit** — preview tooling can't reliably
  simulate Tab. Walk the page with keyboard once it's deployed.
- **"Save 15% as a set" discount language** — removed from the routine CTA
  copy because there's no transactional surface to honour it. Re-add when
  the external store has the bundle.
- **Real product photography** — current product visuals are hand-drawn SVGs.
  Beautiful, but a real launch will want photography (or a deliberate decision
  to keep illustrations as the brand language).
- **OG share image** — needed for Phase 1. 1200×630 PNG; brand-aligned.

## Later

- **Build script to sync `data/products.json` → inline `<script>` in
  index.html** — currently hand-synced (6 products, low churn, low risk).
  Worth automating only if the catalog grows or if a CMS is added.
- **Multi-page architecture** — split per-product pages out of `index.html`
  if SEO needs individual product URLs. Only useful once there's product
  copy worth ranking.
- **Translate the 5 legal pages to EN** — bilingual landing shipped (ADR-0014)
  but `privacy.html` / `terms.html` / `cookies.html` / `shipping.html` /
  `accessibility.html` are still TR-only. Blocked on counsel sign-off of the
  TR drafts (ADR-0012 review gate) so we don't translate copy that's about
  to change. When counsel approves, create `en/privacy.html` etc. with EN
  copy and update each TR page's `hreflang` block to point at the
  alternates.
- **EN copy review** — first-pass EN translation in `en/index.html` was
  AI-authored from the TR source matching the warmly-editorial brand voice.
  Walk through it once before flipping noindex → index, with attention to
  the founder-story paragraphs, the lab-results phrasing, and the testimonial
  voices (real customers, want their quotes to sound natural in EN).
- **Cookie consent banner** — only required if Phase 2 swaps in tools that
  set non-essential cookies (e.g., GA4 instead of CF Web Analytics, or any
  Meta/TikTok pixel).
- **Ingredient compliance page** — INCI lists, allergen flags, sourcing
  notes. Builds trust + supports KVKK/EU labeling expectations.
- **Journal / blog** — content marketing channel. Lots of structural work
  if it goes deep; light if it's just a single static "Journal" page.

## Won't do (recorded so we don't revisit)

- **Build into a JS framework** — current vanilla approach is appropriate
  for the scope. Would only revisit if a real store gets bolted on here
  (which contradicts the current scope decision).
- **Add a real cart on this page** — explicitly out of scope per the
  onboarding decision. CTAs link out instead.
