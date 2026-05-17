# 0004 — Klaviyo for newsletter capture

- **Status:** Proposed
- **Date:** 2026-05-17

## Y-Statement

In the context of capturing email signups from a launching DTC
beauty brand, facing the choice between Klaviyo, Mailchimp,
Beehiiv, ConvertKit, and rolling our own with Resend +
spreadsheet, we decided **for Klaviyo**, to achieve **the
strongest ecommerce-aware automation and segmentation as the
brand grows, plus immediate compatibility with Shopify if/when
a storefront is added**, accepting **higher fees once the list
crosses ~250 contacts (free tier ceiling)**.

## Context

For a DTC beauty/skincare brand, email is the primary owned-
audience asset and the highest-ROI marketing channel. The choice
locks in for a while — list portability is real (export contacts
anytime), but flow rebuilding is a sunk cost.

- **Klaviyo:** the DTC/Shopify default. Best-in-class flows
  (welcome, abandoned cart, replenishment). Free up to 250
  contacts, 500 monthly emails. Free product reviews via Klaviyo
  Reviews. Strong segmentation. Expensive after ~5k contacts.
- **Mailchimp:** broad-purpose. Was the default; now expensive
  and less DTC-focused. Free up to 500 contacts.
- **Beehiiv:** strong for content/newsletter brands. Free up to
  2,500 subscribers. Less DTC-specific tooling.
- **ConvertKit / Kit:** creator-focused. Less DTC tooling.

## Decision

Klaviyo. Embed the signup form via Klaviyo's embedded form
script in the footer and (Phase 2) as a post-quiz capture.

## Consequences

**Positive:**
- Future-proof for when a Shopify store is added — Klaviyo is
  the path of least resistance there.
- Flows ready out of the box: welcome series, browse
  abandonment (when product pages exist), re-engagement.
- Built-in segmentation by skin concern (we can tag submitters
  from the quiz with their concern + skin type).

**Negative:**
- Lock-in is moderate — exporting contacts is fine; rebuilding
  flows is not.
- Pricing climbs above ~5k contacts (~$45+/mo). Premium per-
  contact pricing for DTC's tooling premium.

**Reversibility:** Two-way for the list. One-way for the flows
(would need to be rebuilt).

## Confirmation

Newsletter form in the footer submits successfully to Klaviyo;
test signup appears in the Klaviyo dashboard within 60 seconds;
welcome email arrives.
