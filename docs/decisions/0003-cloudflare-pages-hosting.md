# 0003 — Cloudflare Pages for hosting

- **Status:** Proposed
- **Date:** 2026-05-17

## Y-Statement

In the context of hosting a static brand landing,
facing the choice between Netlify, Vercel, Cloudflare Pages,
and GitHub Pages, we decided **for Cloudflare Pages**, to achieve
**free unlimited bandwidth, automatic HTTPS, fast global edge
delivery, integrated free analytics, and git-based deploys**,
accepting **a Cloudflare account dependency**.

## Context

The site is fully static. Any static host works. The interesting
axes are: price, bandwidth ceiling, geographic latency, SSL, edge
features, and analytics integration.

- **Netlify:** generous free tier, deploy previews, easy custom
  domain. Slow free-tier build queue.
- **Vercel:** great DX, but optimised for Next.js — overkill for
  this site. Free tier has commercial-use restrictions.
- **GitHub Pages:** free, fine for OSS; weaker edge/CDN, no
  built-in analytics, no edge functions.
- **Cloudflare Pages:** free unlimited bandwidth, fast global
  edge, free Web Analytics (privacy-first, no cookies), free
  edge functions if ever needed, easy custom domain.

## Decision

Cloudflare Pages, deployed via GitHub integration when the repo
is pushed.

## Consequences

**Positive:**
- Free at this scale, with no surprise bills if a campaign
  spikes traffic.
- Privacy-first analytics avoids needing a cookie banner
  (see [0005](0005-cloudflare-web-analytics-privacy-first.md)).
- Edge functions and KV are available if we ever need server-side
  logic (form submissions, dynamic redirects, A/B tests).

**Negative:**
- Account/vendor lock-in for DNS + analytics if we use the full
  stack. Mitigated by Cloudflare being commodity-priced and
  exportable.

**Reversibility:** Two-way. Static site can move to any host;
DNS swap is ~1 hour. Analytics is the stickiest piece — if we
later move to GA4, we lose historical CF Analytics data.

## Confirmation

Deploy succeeds, custom domain resolves with valid SSL, and the
site loads on the global edge with sub-300ms TTFB from a sample
of major cities.
