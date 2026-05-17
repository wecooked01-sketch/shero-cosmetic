# 0005 — Cloudflare Web Analytics (privacy-first)

- **Status:** Proposed
- **Date:** 2026-05-17

## Y-Statement

In the context of measuring traffic on a brand landing that
collects no transactions on-site, facing the choice between
Google Analytics 4, Plausible, Fathom, and Cloudflare Web
Analytics, we decided **for Cloudflare Web Analytics**, to
achieve **basic traffic insight without cookies, without a
GDPR consent banner, and without paid SaaS fees**, accepting
**a simpler feature set than GA4 (no funnels, no goals, no
cross-domain stitching)**.

## Context

Analytics on a landing page needs: page views, top referrers,
top countries, top pages, basic event tracking for outbound
clicks. It does *not* need: deep conversion attribution,
multi-touch modeling, audience export for ad platforms — that
work happens on the eventual external store.

- **GA4:** powerful, but sets cookies → requires consent banner
  → adds friction. Free.
- **Plausible:** $9/mo, privacy-first, no cookies. Clean UI.
- **Fathom:** $14/mo, privacy-first. Similar to Plausible.
- **Cloudflare Web Analytics:** free, privacy-first, no cookies,
  bundled with hosting choice ([0003](0003-cloudflare-pages-hosting.md)).

## Decision

Cloudflare Web Analytics. Add the snippet to `index.html`. Use
outbound link event tracking (when added in Phase 2) via a
small JS shim that pushes to Cloudflare's beacon API.

## Consequences

**Positive:**
- No cookie banner needed (single biggest UX win).
- Free, no setup friction beyond pasting a snippet.
- Bundled with the hosting platform — one less account.

**Negative:**
- No GA4 means no easy export to ad platforms for retargeting.
  If a paid-acquisition strategy is added later, we'll need
  to add the Meta/TikTok pixel and reintroduce consent.

**Reversibility:** Two-way. Snippets are removable; historical
data does not transfer between providers.

## Confirmation

24 hours after deploy, the CF Analytics dashboard shows traffic
data for the production URL with page views, top pages, and
referrers.
