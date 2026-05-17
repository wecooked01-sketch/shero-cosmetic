# Milestones

## Phase 0 — Foundation ✅ (done, 2026-05-17)

- ✅ git init + .gitignore
- ✅ Memory + ADR scaffolding (`.ai/`, `docs/decisions/`, `CLAUDE.md`, `README.md`)
- ✅ Extract product data to `data/products.json` (canonical)
- ✅ Embed product data inline in `index.html` for runtime
- ✅ Refactor `script.js` quiz result to read from inline product data
- ✅ Remove dead `:scope::after` querySelector line
- ✅ Add optional-chaining guards for DOM lookups
- ✅ Add SRI integrity hashes to GSAP CDN scripts
- ✅ Smoke test via local preview
- ✅ Initial commit (30408b6)

## Phase 1 — SEO + social ✅ (done, 2026-05-17)

- ✅ Canonical URL (`https://sherocosmetic.com/`) + meta robots
- ✅ Open Graph tags (type, site_name, title, description, url, image, image:width/height/alt, locale)
- ✅ Twitter Cards (summary_large_image)
- ✅ JSON-LD structured data: Organization + WebSite (linked via @id)
- ✅ `sitemap.xml`
- ✅ `robots.txt` (allow all + sitemap pointer)
- ✅ `theme-color` meta for mobile chrome
- ✅ OG image `1200x630.png` confirmed landscape and serving 200
- ⏳ Favicon set — deferred per owner request
- ⏳ Product JSON-LD — deferred until product detail pages exist with offers
  (Google requires offers or aggregateRating for Product rich results)
- ⏳ `lang="en"` confirmation vs Turkish/bilingual — backlog

## Phase 2 — Real integrations ⏳

## Phase 2 — Real integrations ⏳

- Newsletter → Klaviyo (footer + post-quiz capture)
- Contact form → Formspree (real submission, spam protection)
- Analytics → Cloudflare Web Analytics (no consent banner needed)
- UTM-tagged outbound CTAs once the external store URL is known
- Outbound link tracking event hooks

## Phase 3 — UI/UX Pass ✅ (done 2026-05-17, four-batch full pass)

### Batch 1 — Accessibility primitives (commit 573e1e5)
- ✅ `prefers-reduced-motion` CSS guards (zero animation/transition,
  kill scroll-line / press marquee / pulsing dot loops)
- ✅ REDUCE_MOTION constant in script.js — skips hero scrub parallax,
  snaps slide-in animation to final state, fast-paths reveal helpers
- ✅ ARIA live announcer + announce() helper
- ✅ Quiz step transitions: focus the new h3 + announce step number
- ✅ Slider manual nav announce with innerHTML→space conversion
- ✅ Mobile nav focus trap (Tab/Shift-Tab wrap) + restore on close
- ✅ `transition: all` on .mobile-nav__close → specific properties
  (prevents the visibility-transition focus-trap bug)
- ✅ Slider gets `aria-roledescription="carousel"` + label
- ✅ form-note gets `role="status"`

### Batch 2 — Contrast, focus rings, touch targets (commit 7b79864)
- ✅ Added `--rose-gold-text: #9A4F5C` (≈5.4:1 on cream, vs original
  4.04:1 fail) and applied to 10 small-text sites
- ✅ 11 :focus-visible rules covering every interactive element;
  blush rings for dark-bg controls, dashed ring for programmatic
  focus on quiz step headings
- ✅ Touch-target bumps: icon-btn, menu-btn, mobile-nav__close,
  slider-arrow--small, mobile-nav__socials all → 44×44
- ✅ Dot tap area expanded via transparent ::before pseudo (inset:-18px)
  without changing the visible 10/8px dot

### Batch 3 — Mobile layout + perf (commit 111e0e5)
- ✅ Hero slider controls flow below the slide on mobile/tablet
  (was absolute-positioned and overlapping the SHOP NOW / DISCOVER
  buttons at the 768x1024 breakpoint)
- ✅ Inactive slides hidden via display:none in the mobile media
  query so the active slide is the only one occupying flow
- ✅ Hero auto-height on mobile (removes 100vh constraint that was
  cramping content)
- ✅ .about__circle: width: min(420px, 90vw) + aspect-ratio: 1/1
  (no overflow on small screens)
- ✅ `<link rel="preconnect">` for jsdelivr.net so GSAP CDN handshake
  overlaps document parse

### Batch 4 — Conversion-flow polish (commit pending)
- ✅ Quiz result: "Explore your routine" promoted to primary `<a>`
  → #routine, "Retake quiz" demoted to ghost secondary
- ✅ Routine CTA: "Build my set" → "Find my set" rewired to #quiz
  (was misleading link to #contact)
- ✅ Routine description rewritten to support the new flow
- ✅ All forward CTAs marked with `data-cta` + `data-cta-campaign`
  + `data-cta-content` per ADR-0007 — ready for Phase 2 to swap
  internal anchors for UTM-tagged external store URLs

### Verified
- 768x1024 (tablet): hero CTAs no longer overlap slider controls
- 375x812 (mobile): clean stack across hero / about / quiz /
  ingredients / routine / testimonials / contact / footer
- Quiz E2E: combo → dullness → balanced renders 3 product cards
  reading from inline JSON data, focus + announce both fire
- No console errors at any breakpoint
- All :focus-visible rules registered (11 selectors)

### Deferred from this phase (in `.ai/backlog.md`)
- Lighthouse measurement (need a deployed URL — comes after Phase 5)
- Routine card mobile "tap to expand" affordance (current copy says
  "Hover each card" which is misleading on touch devices)
- Full keyboard-traversal manual audit (preview can't reliably
  simulate Tab key)

## Phase 4 — Legal + compliance ⏳

- Privacy policy (KVKK + GDPR)
- Terms of use
- Cookie policy + (only if needed) consent banner
- Accessibility statement
- Imprint (depends on jurisdictions targeted)

## Phase 5 — Deploy 🔄 (staging done, production migration pending)

- ✅ git remote: `wecooked01-sketch/shero-cosmetic` on GitHub (public)
- ✅ All 7 commits pushed to `main`
- ✅ GitHub Pages enabled, serving from `main /`, HTTPS-enforced
- ✅ Staging live: https://wecooked01-sketch.github.io/shero-cosmetic/
- ✅ Staging guardrails:
  - `<meta name="robots" content="noindex, nofollow">` in index.html
  - `Disallow: /` in robots.txt
  - Canonical / og:url / og:image still pinned to sherocosmetic.com
- ✅ ADR-0009 records the staging-now / production-later split

- ⏳ Production migration (blocked on the owner):
  1. Create/use a Cloudflare account, point DNS for sherocosmetic.com
  2. Cloudflare Pages → Connect Git → pick `shero-cosmetic` → Deploy
  3. CF Pages → Custom domain → sherocosmetic.com → SSL auto
  4. In the repo: flip meta robots back to `index, follow, ...` and
     robots.txt back to `Allow: /`
  5. Disable GitHub Pages on the repo (Settings → Pages → None) to
     avoid two live mirrors

## Phase R — Visual identity redesign 🔄 (in progress, 2026-05-17)

Triggered by owner's "redesign the UI UX" + B&W + Manrope + dark mode
+ better animations request. ADR-0010 records the decision.

### R1 — Foundation ✅
- ✅ New apothecary B&W token system (--bg, --ink, --ink-soft, etc.)
- ✅ Light + dark themes (auto via prefers-color-scheme, manual via
  data-theme + localStorage)
- ✅ No-flash inline script in <head>
- ✅ Theme toggle button in header with sun/moon SVG swap
- ✅ Manrope swap (display + body, single family)
- ✅ Hardcoded rose/blush rgba values replaced with neutral
- ✅ Footer rebuilt to theme-adapt (was hardcoded dark band, broken
  in dark mode)
- ✅ Testimonial avatars: removed inline pink gradients, now solid ink
- ✅ Search icon hidden on mobile so theme toggle fits the row
- ✅ Existing :focus-visible / contrast / touch-target work all
  carries forward (uses --ink which contrasts in both themes)

### R2 — SVG bottles → monochrome line-art ✅
- ✅ All 3 hero bottles (Radiance Serum / Hydra Cream / Glow Elixir)
  redrawn as line-art: stroke="currentColor", fill="none" outlines,
  solid currentColor caps for visual weight, `.bottle__label` class
  with fill: var(--bg) so the label surface adapts per theme
- ✅ Manrope typography on every label (italic SHERO, tracked product
  name, smaller variant line)
- ✅ Heavy pink drop-shadow on .bottle replaced with subtle
  rgba(0,0,0,.12) drop-shadow for grounding without floating
- ✅ .product-glow neutralized (kept in DOM for the GSAP entry
  animation; visibility: hidden + zero size so it has no paint)
- ✅ .about__leaf SVG also de-pinked — same currentColor + opacity
  treatment, theme-adaptive
- ✅ .about__circle gradient swapped to neutral bg-alt → line

### R3 — Animation rework ⏳
- Replace opacity+y entries with mask reveals
- Magnetic CTAs (~6px drift toward cursor)
- Cursor-follow on hero (desktop only)
- Sticky scrub on the routine 5-step section

### R4 — Section-level UI/UX polish ⏳
- Hero composition rethink (current grid was tuned for warm-luxe)
- Quiz card visual treatment under apothecary
- Footer / newsletter polish
- Press marquee — drop the script/serif font variants (Manrope-only now)

## Phase 6 — Content / product expansion (optional) ⏳

- Per-product pages or modal detail views
- Journal / blog scaffold
- Founder story page
- Ingredient deep-dive pages
