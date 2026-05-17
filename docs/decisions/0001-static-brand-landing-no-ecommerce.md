# 0001 — Static brand landing, no on-page ecommerce

- **Status:** Accepted
- **Date:** 2026-05-17
- **Decider:** wickedbro (project owner)

## Y-Statement

In the context of launching the SHERO COSMETIC brand online,
facing the choice between building a full storefront here vs.
a separate marketing landing that links to an external commerce
channel, we decided **for a static product-display landing** and
against running ecommerce on this codebase, to achieve **fast
launch, lowest complexity, and clean separation of brand
storytelling from transactional concerns**, accepting that
**sales must be handled elsewhere** (Shopify, Amazon, retail, etc.)
and that adding direct sales here later requires a separate
project decision.

## Context

The original framing was "real brand launching for sale," which
implied a full ecommerce build. The owner clarified that this
site is *product display only* — sales will happen on a separate
channel, currently TBD.

A full ecommerce build (Shopify themed port, headless Astro +
Shopify, or static + Snipcart) was scoped at 2–14 weeks
depending on path, with $20–$200/month operational cost and
significant compliance overhead (MoCRA, PCI scope, tax/shipping
engines, fraud, etc.).

A static brand landing has none of those obligations and ships
in days.

## Options considered

1. **Static brand landing → external store** *(chosen)*
2. Shopify themed port — heavier, but adds a full commerce backbone
3. Headless Astro + Shopify — heaviest, most flexible
4. Static + Snipcart/Stripe Checkout — middle ground

## Consequences

**Positive:**
- Fast time-to-first-impression. No platform fees on the marketing
  surface. Total design control. No PCI obligations on this site.
- The team can experiment with sales channels independently
  (Amazon now, Shopify later, retail in parallel) without rebuilding
  this site.

**Negative:**
- No conversion happens on this site. Every CTA is a bounce to an
  external destination — measurable, but a UX seam.
- If sales eventually move on-site, this codebase has to be
  re-evaluated (probably ported to Shopify or rebuilt as headless).
  See [0002](0002-product-data-inline-with-canonical-json.md) for
  the mitigation (decoupled product data) that lowers the cost of
  that future migration.

**Reversibility:** Two-way door for adding a lightweight cart
(Snipcart/Stripe Checkout), one-way door for replatforming to
Shopify/headless. Treat any change here as a new ADR.

## Confirmation

Compliance: this ADR is enforced by absence — there is no cart UI,
no `/checkout` route, no payment SDK loaded. Any PR adding those
must supersede this ADR.
