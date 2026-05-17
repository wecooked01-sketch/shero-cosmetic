# 0008 — GSAP via CDN with SRI integrity hashes

- **Status:** Accepted
- **Date:** 2026-05-17

## Y-Statement

In the context of loading GSAP + ScrollTrigger for the site's
animations, facing the choice between self-hosting the bundled
files vs. loading from jsDelivr CDN with or without Subresource
Integrity (SRI) hashes, we decided **for jsDelivr CDN with
explicit SRI hashes pinned to gsap@3.12.5**, to achieve **fast
global delivery, browser-cache reuse across sites, and tamper-
detection in case the CDN is ever compromised**, accepting **a
hard dependency on jsDelivr availability**.

## Context

The previous setup loaded GSAP from jsDelivr without integrity
hashes. If the CDN is ever compromised (rare, but real — see
the polyfill.io incident, June 2024), every visitor would
execute attacker-controlled JS. SRI shifts that risk from "trust
the CDN forever" to "trust the CDN at the moment we pinned the
hash."

Self-hosting is the alternative — guaranteed availability, zero
third-party trust — but loses the cache-reuse benefit of a
popular CDN.

## Decision

Keep jsDelivr, add `integrity="sha384-…"` and
`crossorigin="anonymous"` attributes on both `<script>` tags.
Pin to gsap@3.12.5 explicitly; do not use `@latest`.

### Pinned hashes (gsap@3.12.5)

```
gsap.min.js:           sha384-g4NTh/Iv5PPU4xPyhEWqPcwtNXOvdaDI8LLnyYfyNZOjKJeYQyjzQ9X5275eBjpt
ScrollTrigger.min.js:  sha384-Z3REaz79l2IaAZqJsSABtTbhjgOUYyV3p90XNnAPCSHg3EMTz1fouunq9WZRtj3d
```

If GSAP is upgraded, re-compute the hashes:

```bash
curl -sS https://cdn.jsdelivr.net/npm/gsap@<ver>/dist/gsap.min.js \
  | openssl dgst -sha384 -binary | openssl base64 -A | sed 's|^|sha384-|'
```

## Consequences

**Positive:**
- A CDN compromise produces a browser-level load failure
  (visible, reportable) rather than silent attacker execution.
- Cache reuse across sites still available.
- No build step or self-hosting overhead.

**Negative:**
- Hard pin to gsap@3.12.5 — upgrades require updating both
  URL and hash in `index.html`.
- jsDelivr outage = no animations until the script falls back
  to cache. (Site degrades gracefully — content is server-
  rendered HTML.)

**Reversibility:** Two-way. Could be swapped for self-hosting
in an afternoon.

## Confirmation

`index.html` `<script>` tags for both gsap and ScrollTrigger
carry `integrity="sha384-…"` and `crossorigin="anonymous"`
attributes. Page loads animations in a real browser without
console errors.
