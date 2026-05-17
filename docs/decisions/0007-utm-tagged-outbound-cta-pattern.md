# 0007 — UTM-tagged outbound CTA pattern

- **Status:** Proposed
- **Date:** 2026-05-17

## Y-Statement

In the context of CTAs that link from this brand landing to an
external storefront (Shopify, Amazon, retail partners, etc.),
facing the choice between bare links, shortened links via a URL
shortener, and consistently-tagged UTM links, we decided **for
UTM-tagged direct links following a documented naming
convention**, to achieve **attribution of which page section
drove each external visit, without adding a redirect dependency**,
accepting **slightly noisier URLs in browser history**.

## Context

Once the external store URL exists, every "Shop Now" / "Build my
set" / footer link needs to be measurable on the destination side.
That requires consistent UTM tagging applied at this end.

UTM conventions for this site (to be enforced once URL exists):

| Param | Value pattern | Example |
|---|---|---|
| `utm_source` | `brand-landing` | `brand-landing` |
| `utm_medium` | `cta` for inline buttons; `nav` for nav links; `footer` for footer | `cta` |
| `utm_campaign` | section name kebab-case | `hero`, `routine`, `quiz-result` |
| `utm_content` | element identifier kebab-case | `slide-1-radiance-serum`, `routine-cta-build-set` |

Outbound links should use `target="_blank" rel="noopener noreferrer"` to
protect the destination and our window.

## Decision

Centralize CTA destination in a single helper (`buildStoreUrl(campaign,
content)`) that lives in `script.js`. At render time, rewrite anchors
flagged `data-cta` to use the helper. This way the eventual store URL is
one config value to change.

## Consequences

**Positive:**
- Attribution works on day one of having a store.
- Single point of change when the destination URL is known.
- Convention prevents naming drift across sections.

**Negative:**
- Slightly more JS at module init time.
- UTMs are visible in the URL bar (mild UX seam).

**Reversibility:** Fully two-way.

## Confirmation

Once the store URL is provided, all CTAs marked `data-cta` route to
URLs with the expected UTM parameters, verifiable in network panel.
