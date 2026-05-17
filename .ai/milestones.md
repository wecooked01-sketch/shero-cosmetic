# Milestones

## Phase 0 — Foundation 🔄 (in progress, 2026-05-17)

- ✅ git init + .gitignore
- ✅ Memory + ADR scaffolding (`.ai/`, `docs/decisions/`, `CLAUDE.md`, `README.md`)
- ✅ Extract product data to `data/products.json` (canonical)
- ✅ Embed product data inline in `index.html` for runtime
- ✅ Refactor `script.js` quiz result to read from inline product data
- ✅ Remove dead `:scope::after` querySelector line
- ✅ Add optional-chaining guards for DOM lookups
- ✅ Add SRI integrity hashes to GSAP CDN scripts
- ⏳ Smoke test via local preview
- ⏳ Initial commit

## Phase 1 — SEO + social ⏳

- `<title>` and meta description per-section concept (single page, but tunable)
- Favicon set (16/32/180/512)
- Open Graph tags + Twitter cards
- `Organization` + `Product` JSON-LD structured data
- `sitemap.xml`, `robots.txt`
- Canonical URL
- `lang="en"` is current — confirm whether `tr` or bilingual is needed

## Phase 2 — Real integrations ⏳

- Newsletter → Klaviyo (footer + post-quiz capture)
- Contact form → Formspree (real submission, spam protection)
- Analytics → Cloudflare Web Analytics (no consent banner needed)
- UTM-tagged outbound CTAs once the external store URL is known
- Outbound link tracking event hooks

## Phase 3 — Accessibility + performance ⏳

- WCAG 2.2 AA pass
  - `aria-live` regions for quiz step + slider transitions
  - Focus management on mobile nav open/close
  - `prefers-reduced-motion` short-circuit for GSAP
  - Color contrast audit
  - Keyboard-only traversal test
- Lighthouse target: ≥95 across Performance / Accessibility / Best Practices / SEO
- Image / SVG optimization audit
- Font preloading review

## Phase 4 — Legal + compliance ⏳

- Privacy policy (KVKK + GDPR)
- Terms of use
- Cookie policy + (only if needed) consent banner
- Accessibility statement
- Imprint (depends on jurisdictions targeted)

## Phase 5 — Deploy ⏳

- Cloudflare Pages connection (GitHub → CF Pages)
- Custom domain
- SSL + HSTS
- Staging URL for review

## Phase 6 — Content / product expansion (optional) ⏳

- Per-product pages or modal detail views
- Journal / blog scaffold
- Founder story page
- Ingredient deep-dive pages
