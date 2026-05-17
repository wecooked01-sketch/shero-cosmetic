# 0009 — GitHub Pages for staging; Cloudflare Pages for production

- **Status:** Accepted
- **Date:** 2026-05-17
- **Relates to:** [0003](0003-cloudflare-pages-hosting.md)

## Y-Statement

In the context of getting a real live URL today, facing the choice
between Cloudflare Pages (per [ADR-0003](0003-cloudflare-pages-hosting.md))
and GitHub Pages, we decided **for GitHub Pages now as a staging surface,
keeping Cloudflare Pages as the production target**, to achieve **zero
extra accounts and a live URL within minutes**, accepting **a weaker
CDN edge and the operational task of migrating when the production
domain lands**.

## Context

[ADR-0003](0003-cloudflare-pages-hosting.md) recommends Cloudflare
Pages for production hosting (free unlimited bandwidth, edge speed,
free privacy-first analytics, no consent banner needed). All of
that still stands.

But Cloudflare Pages requires:
1. A Cloudflare account (the agent could not create one on the owner's
   behalf).
2. A connection from the CF Pages dashboard to the GitHub repo (a UI
   action the agent could not perform).

GitHub Pages requires neither — `gh` was already authenticated locally,
the repo could be created + Pages enabled via API in a single session.
The owner accepted the tradeoff: ship something today, migrate later.

The agent's available tooling at deploy time:
- `gh` CLI authenticated as `wecooked01-sketch` ✓
- `wrangler` CLI: not installed
- `netlify` CLI: not installed
- No git remote pre-configured

## Decision

**Staging (today):** GitHub Pages from the `main` branch of the
public repo `wecooked01-sketch/shero-cosmetic`. Live URL:
`https://wecooked01-sketch.github.io/shero-cosmetic/`.

**Production (later):** Cloudflare Pages connected to the same
repo, serving from the production domain (currently
`https://sherocosmetic.com/` per
[`index.html`](../../index.html) canonical metadata).

### Staging guardrails

The staging URL must not pollute search results for the brand. Until
production DNS is live, the staging deploy is configured as follows:

- `<meta name="robots" content="noindex, nofollow" />` in
  [`index.html`](../../index.html).
- `Disallow: /` in [`robots.txt`](../../robots.txt).
- `<link rel="canonical">`, `og:url`, `og:image`, JSON-LD `Organization
  .url`, and `sitemap.xml` all remain pinned to
  `https://sherocosmetic.com/` — the canonical destination, not the
  staging URL. (Social share previews from the staging URL will 404
  on the og:image until production is live; acceptable given staging
  is not meant to be shared publicly.)

## Migration path to Cloudflare Pages

When the production domain DNS is being pointed somewhere real:

1. Owner creates a Cloudflare account (or uses existing) and links
   the brand domain.
2. Cloudflare Pages → "Connect to Git" → pick
   `wecooked01-sketch/shero-cosmetic` → build settings: framework
   "None", build command empty, output directory `/` → Deploy.
3. Cloudflare Pages → Custom domain → `sherocosmetic.com` → CF
   handles SSL.
4. In the repo, flip these back to production mode:
   - `index.html` → `<meta name="robots" content="index, follow,
     max-image-preview:large" />`
   - `robots.txt` → `Allow: /`
5. Disable GitHub Pages on the repo (Settings → Pages → "None") to
   avoid two live mirrors.
6. Add a redirect from `wecooked01-sketch.github.io/shero-cosmetic/`
   to `https://sherocosmetic.com/` if anything links it externally
   (probably nothing will — it's been noindex/Disallow throughout).

## Consequences

**Positive:**
- Live URL in under 10 minutes from a cold start, no extra accounts.
- Zero cost.
- Auto-deploys on every push to `main`.

**Negative:**
- Weaker CDN edge than Cloudflare (less critical at pre-launch
  traffic levels).
- No built-in analytics. Cloudflare Web Analytics
  ([ADR-0005](0005-cloudflare-web-analytics-privacy-first.md)) still
  works as a script-tag snippet from any host, but we haven't added
  it yet (Phase 2 work).
- Migration day requires the cleanup steps above. Not hard, but real.

**Reversibility:** Fully two-way. Same code, different hosts.

## Confirmation

`HTTP/2 200` on the live URL with correct `content-type` for
`index.html`, `styles.css`, `script.js`, `1200x630.png`, `robots.txt`,
`sitemap.xml`. Verified at deploy time.
