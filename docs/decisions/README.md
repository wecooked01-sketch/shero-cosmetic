# Architecture Decision Records

Significant architectural decisions for the SHERO COSMETIC landing site,
recorded in [MADR](https://adr.github.io/madr/) format with Y-Statements.

Read these before making structural changes. If you're about to overturn
one, supersede it explicitly (new ADR, mark the old one `Superseded by NNNN`).

## Index

| ID | Title | Status | Date |
|---|---|---|---|
| [0001](0001-static-brand-landing-no-ecommerce.md) | Static brand landing, no on-page ecommerce | Accepted | 2026-05-17 |
| [0002](0002-product-data-inline-with-canonical-json.md) | Product data: canonical JSON file + inline embed | Accepted | 2026-05-17 |
| [0003](0003-cloudflare-pages-hosting.md) | Cloudflare Pages for hosting | Proposed | 2026-05-17 |
| [0004](0004-klaviyo-for-newsletter.md) | Klaviyo for newsletter capture | Proposed | 2026-05-17 |
| [0005](0005-cloudflare-web-analytics-privacy-first.md) | Cloudflare Web Analytics (privacy-first) | Proposed | 2026-05-17 |
| [0006](0006-formspree-for-contact-form.md) | Formspree for the contact form | Proposed | 2026-05-17 |
| [0007](0007-utm-tagged-outbound-cta-pattern.md) | UTM-tagged outbound CTA pattern | Proposed | 2026-05-17 |
| [0008](0008-gsap-via-cdn-with-sri.md) | GSAP via CDN with SRI integrity hashes | Accepted | 2026-05-17 |
| [0009](0009-github-pages-staging-then-cloudflare-pages.md) | GitHub Pages for staging; Cloudflare Pages for production | Accepted | 2026-05-17 |
| [0010](0010-visual-identity-apothecary-bw-manrope.md) | Visual identity pivot: apothecary B&W + Manrope | Superseded by 0011 | 2026-05-17 |
| [0011](0011-visual-identity-warm-decorative-photography.md) | Visual identity pivot #2: warm + decorative + photography-led | Accepted | 2026-05-18 |
| [0012](0012-legal-pages-as-noindex-drafts.md) | Legal pages ship as noindex draft templates | Accepted | 2026-05-18 |
| [0013](0013-typography-fraunces-manrope.md) | Typography rewrite: Fraunces + Manrope, one family per headline | Accepted | 2026-05-18 |
| [0014](0014-bilingual-tr-default-en-static-duplication.md) | Bilingual site: static page duplication, TR-default, `/en/` for English | Accepted | 2026-05-18 |

## Statuses

- **Proposed** — written down, not yet acted on
- **Accepted** — implemented or in active implementation
- **Superseded by NNNN** — overturned; the new ADR explains why
- **Deprecated** — was relevant, no longer applies
