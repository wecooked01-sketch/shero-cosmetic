# 0012 — Legal pages ship as noindex draft templates

- **Status:** Accepted
- **Date:** 2026-05-18

## Y-Statement

In the context of needing privacy / terms / cookies / shipping /
accessibility pages before production launch, with the constraint that
we do not have qualified legal counsel reviewing copy in real time,
facing the choice between blocking launch until counsel reviews each
page vs. shipping template drafts that are clearly marked as drafts,
we decided **to ship five static legal pages as noindex drafts with a
prominent in-page "Draft template" notice and an ADR-tracked review
gate**, to achieve **a complete footer / SEO surface for staging
review and a structured handoff to counsel**, accepting **that the
pages must not go index/follow until counsel signs off and the draft
banner is removed**.

## Context

Phase 4 of the project plan calls for legal pages. The owner is in
Istanbul, the brand targets Turkey + EU/EEA audiences, so the relevant
regimes are:

- **Turkey:** KVKK (Law no. 6698) — data controller obligations,
  15-day response window for data subject requests.
- **EU/EEA:** GDPR + ePrivacy. EAA (European Accessibility Act, in
  force from 28 June 2025) requires WCAG 2.1 AA on consumer-facing
  digital services.

The site does not run a checkout (ADR-0001), uses no tracking cookies
or third-party trackers (ADR-0005), and uses `localStorage` only for a
single theme preference. That materially shrinks the surface area of
both the cookie and privacy policies relative to a typical DTC site.

## Decision

Five legal pages were created at the root:

| Path | Purpose |
|---|---|
| `privacy.html` | KVKK + GDPR-compatible privacy policy |
| `terms.html` | Terms of use, governing law = Turkey |
| `cookies.html` | Cookie policy (no tracking cookies; localStorage only) |
| `shipping.html` | Defers to retailer; explains the no-on-site-checkout model |
| `accessibility.html` | WCAG 2.1 AA target + known limitations |

Each page:

1. Sets `<meta name="robots" content="noindex, nofollow">` so it never
   gets indexed in its draft state.
2. Carries a visible `.legal-draft` banner near the top stating the
   page is a template pending legal review.
3. Reuses the existing warm-decorative design system — same header,
   footer, CSS tokens. Adds a `.legal-page` reading-column layout
   primitive to styles.css.
4. Footer links are wired from `index.html` to point at the new
   pages.
5. Each legal page also has the same five-link footer so users can
   move between them without going back to home.

## Pre-launch review gate

Before the site goes index/follow (i.e. before flipping ADR-0009
staging → production), all five legal pages must:

- [ ] Be reviewed by qualified legal counsel (Turkey-licensed for
      KVKK; ideally EU-aware for GDPR/EAA).
- [ ] Have the `.legal-draft` banner removed.
- [ ] Have their meta robots flipped to `index, follow,
      max-image-preview:large`.
- [ ] Be added to `sitemap.xml` with a fresh `<lastmod>` date.
- [ ] Have the contact emails (`privacy@`, `legal@`,
      `accessibility@`) actually monitored or replaced with
      `hello@sherocosmetic.com`.

## Consequences

**Positive:**
- The footer is no longer broken (links go somewhere, not `#`).
- Counsel has concrete drafts to redline rather than blank pages.
- The brand can show a complete site to investors / wholesalers
  even before launch.
- Cookie policy and privacy policy are honest about the
  privacy-first stack rather than copying boilerplate that
  describes a tracker-heavy site we don't have.

**Negative:**
- Drift risk: if site behavior changes (e.g. adding Meta Pixel)
  the legal pages will be stale and out-of-compliance until
  re-reviewed.
- Five extra HTML files to maintain. Any structural change
  (header, footer, tokens) means touching six files.

**Reversibility:** Fully reversible — these are static HTML files;
deleting them and removing the footer links restores the prior state.

## Confirmation

- Footer links from `index.html` resolve to the new pages.
- Every legal page renders correctly in light and dark mode
  (uses only existing tokens).
- Every legal page has the noindex meta and the draft banner.
- Cross-page footer navigation works from each legal page.
