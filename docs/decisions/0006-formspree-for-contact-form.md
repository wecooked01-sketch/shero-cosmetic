# 0006 — Formspree for the contact form

- **Status:** Proposed
- **Date:** 2026-05-17

## Y-Statement

In the context of needing the contact form to actually deliver
messages to the brand inbox, facing the choice between Formspree,
Netlify Forms, Cloudflare Workers + Resend, and Getform, we
decided **for Formspree (free tier)**, to achieve **the lowest
implementation cost and zero backend code**, accepting **a
50-submission/month ceiling on the free tier**.

## Context

The current contact form has no backend — submitting shows a
"thank you" note client-side and goes nowhere. For a launching
brand, this is functionally broken.

- **Formspree:** $0 up to 50 submissions/month, $10/mo for 1k.
  Drop-in, no backend code. Spam protection included.
- **Netlify Forms:** $0 up to 100 submissions/month. Requires
  hosting on Netlify (conflicts with [0003](0003-cloudflare-pages-hosting.md)).
- **Cloudflare Workers + Resend/Postmark:** flexible, code-y.
  ~$0 at this scale. Adds a code surface to maintain.
- **Getform:** competitor to Formspree, similar pricing.

## Decision

Formspree on the free tier. Upgrade to Gold ($10/mo) when
volume requires it.

## Consequences

**Positive:**
- 5-minute implementation: change `<form>` action to the
  Formspree endpoint, done.
- No code surface to maintain.
- Spam filtering bundled.

**Negative:**
- Submissions sit on Formspree's servers transiently. KVKK/GDPR
  data processing footnote applies — covered in the Privacy
  Policy in Phase 4.
- Vendor dependency. Mitigated by submissions also emailing to
  the brand inbox (so we have a copy).

**Reversibility:** Two-way. Swapping to a different provider is
a form-action URL change.

## Confirmation

A test submission from the production URL delivers to the
configured brand inbox within 60 seconds and shows in the
Formspree dashboard.
