# 0014 — Bilingual site: static page duplication, TR-default, `/en/` for English

- **Status:** Accepted
- **Date:** 2026-05-18

## Y-Statement

In the context of the site being **Turkish-only since `77055c4`** while the
brand explicitly targets **Turkish + general European audiences**
(CLAUDE.md), facing the choice between **(a) static page duplication**,
**(b) runtime JS i18n that hydrates one page from `data-i18n` attributes
+ a JSON dictionary**, or **(c) introducing a build step that generates
per-locale HTML from a template + dictionary**, we decided **for static
page duplication: TR stays at `/index.html`, English ships at
`/en/index.html`, both pages fully self-contained, switched via a
JS-free anchor pair in the header**, to achieve **SEO-correct bilingual
indexing (each locale has its own canonical URL + `hreflang`), zero
runtime cost for the language switch, and continued conformance with
the "no framework, no bundler, no `package.json`" stack rule
(CLAUDE.md)**, accepting **that copy changes must be applied in two
files, that the two pages can drift if maintenance is sloppy, and that
the legal pages stay TR-only until counsel signs off on the drafts
(ADR-0012)**.

## Context

The site is Turkish-first. `<html lang="tr">`, all visible copy in
Turkish, JSON-LD address in Karaköy/Istanbul. The CLAUDE.md target
audience is **Turkish + general European**, so Turkish-only locks out a
meaningful slice: European readers without functional Turkish.

Three approaches were considered.

**Runtime JS i18n** would have one HTML page with `data-i18n="hero.title"`
attributes, plus `i18n/tr.json` and `i18n/en.json`. JavaScript hydrates
the DOM at load. This is the SPA pattern and it's wrong for SEO in a
no-build static stack: Google indexes the default-language snapshot, and
the EN strings only exist after JS runs against a query-param or
localStorage flag. Without SSR/SSG (which we don't have), the EN
locale would be functionally invisible to search.

**A build step** (something like a tiny Node script that templates
`/en/index.html` from `/index.html` + a swap-table) would solve the
duplication problem but contradicts the foundational stack decision
(no `package.json`, no bundler). Worth re-opening if the catalog grows
or a third locale lands.

**Static page duplication** is the conventional answer for small static
multi-language sites. It's verbose, but the cost lands in a single axis
(file count), not in build complexity, runtime cost, or SEO compromise.

## Decision

### Routing

- **TR (default):** `/index.html` — `<html lang="tr">`
- **EN:** `/en/index.html` — `<html lang="en">`
- Logo link in each page points to its own locale's home (`/` or
  `/en/`), not the cross-locale equivalent. Convention: clicking the
  logo keeps you in your language.

### Switcher

A two-anchor pair in the header right-rail (next to the theme toggle):

```html
<div class="lang-switch" role="group" aria-label="Language">
  <a href="/" class="is-active" hreflang="tr">TR</a>
  <a href="/en/" hreflang="en">EN</a>
</div>
```

- No JS. Each anchor is a real link to the other locale's root.
- The active state is rendered server-side (literally: written into the
  HTML on each page; TR page marks TR active, EN page marks EN active).
- No language persistence beyond the URL. URL is the source of truth.
  No cookies, no localStorage, no `Accept-Language` redirect — those
  add complexity and surprise behaviour without commensurate value at
  this scale.

### `hreflang` and alternates

Each page declares both locale alternates plus `x-default`:

```html
<!-- in /index.html -->
<link rel="alternate" hreflang="tr"        href="https://sherocosmetic.com/" />
<link rel="alternate" hreflang="en"        href="https://sherocosmetic.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://sherocosmetic.com/" />

<!-- in /en/index.html -->
<link rel="alternate" hreflang="tr"        href="https://sherocosmetic.com/" />
<link rel="alternate" hreflang="en"        href="https://sherocosmetic.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://sherocosmetic.com/" />
```

`x-default` points at the TR home: Google's `x-default` is "what to show
when no locale matches the user's preferences," not "what's the default
language." TR is what the brand wants Turkish + everyone-else to land
on when their browser locale doesn't say `en`.

OG locale tags follow the same shape:

```html
<!-- TR page -->
<meta property="og:locale"           content="tr_TR" />
<meta property="og:locale:alternate" content="en_US" />

<!-- EN page -->
<meta property="og:locale"           content="en_US" />
<meta property="og:locale:alternate" content="tr_TR" />
```

`og:url` is per-page (each page declares its own canonical URL).

### Asset paths

Assets live at the repo root (`/assets/`, `/badges/`, `/styles.css`,
`/script.js`, `/data/`). From `/en/index.html`, paths are written
**relatively** with `../` prefix:

- `../styles.css`, `../script.js`
- `../assets/photos/product-foundation.jpg`
- `../badges/peta.png`

Relative paths work in three deployment surfaces — local dev
(`python3 -m http.server`), GitHub Pages staging (which serves under a
project subpath), and Cloudflare Pages production (which serves at
root). Root-relative `/path` would break on GitHub Pages staging
because of the subpath; relative `../` resolves correctly everywhere.

In-page anchor links (`href="#routine"`, `href="#quiz"`, etc.) stay as
`#section-id` — each page has its own copy of every section.

### Quiz JS i18n

`script.js` is shared across both pages (it's loaded as `../script.js`
from `/en/index.html`), so it cannot hard-code Turkish or English
strings. The quiz block was refactored to read all user-facing strings
from a global `window.QUIZ_I18N` object defined inline per page,
before `script.js` loads:

```html
<script>
window.QUIZ_I18N = {
  result: 'Sonuç',
  step: 'adım',
  resultAnnounce: 'Test sonucu',
  stepAnnouncePrefix: 'Cilt testi ',
  stepAnnounceSuffix: '. adım',
  titleByConcern: { dullness: 'Parlaklık Ritüeli', /* ... */ },
  fallbackTitle: 'Size özel ritüel',
  concernLabels: { dullness: 'matlık', /* ... */ },
  typeLabels:   { oily: 'yağlı', /* ... */ },
  cadence:      { ritual: 'tam', quick: 'sade', balanced: 'dengeli' },
  descriptionTemplate: '{type} cilde özel, {concern} odaklı {cadence} bir bakım rutini.',
};
</script>
<script src="../script.js" defer></script>
```

The EN page defines the same shape with English strings. `script.js`
has a Turkish default baked in as a fallback so the quiz still works
if a page forgets to define the override — but the expectation is that
both pages define their own.

The `descriptionTemplate` uses `{type}`/`{concern}`/`{cadence}`
placeholders, not `${...}` string interpolation, because Turkish and
English put the modifiers in different orders. TR: "yağlı cilde özel,
matlık odaklı tam bir bakım rutini." EN: "A full routine focused on
dullness, tailored for oily skin." Same data, different sentence
construction.

### Inline product data

`data/products.json` stays single-language-keyed (TR) — it's the
canonical source for the TR page. The EN page inlines its own copy of
the same data with English `name` and `tag` fields. For six SKUs this
is acceptable duplication; if the catalog grows past ~15 products or
gets a CMS, revisit and split products into per-locale JSON files.

### Sitemap

`sitemap.xml` lists both URLs. Each `<url>` includes an `<xhtml:link>`
alternate pointing to the other locale, per Google's recommendation
for hreflang annotations in sitemaps.

### Scope of this decision

This ADR covers `/index.html` only. The five legal pages
(`privacy.html`, `terms.html`, `cookies.html`, `shipping.html`,
`accessibility.html`) stay **TR-only** until legal counsel signs off
on the drafts (the review gate in ADR-0012). Translating noindex
draft copy now is premature — counsel is the most likely source of
substantive rewrites, and translating now would double the rework.
When counsel approves the TR copy, a follow-up ADR can record the
decision to translate the legal pages.

## Consequences

### Positive

- **SEO-correct.** Each locale is independently crawlable, indexable,
  and ranks on its own merits. `hreflang` tells Google which to serve
  per user.
- **No JS required to switch.** The switcher is two anchor tags. Works
  with JS disabled, works during page load before any script runs.
- **No build step.** The static stack rule from CLAUDE.md is preserved.
- **No runtime state to manage.** No cookies, no localStorage, no
  Accept-Language detection. URL is the source of truth.
- **Each page is fully self-contained.** A reader can save the HTML
  file, the relative asset paths resolve correctly on any deploy.

### Negative

- **Maintenance surface doubles.** Copy changes to `index.html` must be
  mirrored in `/en/index.html`. There's no automation; discipline is
  the safeguard. If a future maintainer ships a TR-only copy tweak and
  forgets the EN counterpart, the pages drift.
- **Two inline copies of the product data.** Same data, two formats
  (TR + EN). Same drift risk as above.
- **No accept-language redirect.** A first-time visitor from a browser
  with `Accept-Language: en` will land on TR by default. They'll have
  to click EN. This is intentional (no redirects = no surprise URL
  flips; `x-default` handles the search-engine side), but it does mean
  the discoverability of the EN page depends on the switcher being
  noticeable.
- **Legal pages stay TR-only.** A non-TR reader who clicks "Privacy
  Policy" in the EN footer gets a Turkish page. Acceptable for noindex
  draft state; must be revisited before the legal pages flip to
  `index, follow` (ADR-0012 review gate).

### Migration record

| Step | What |
|---|---|
| `script.js` | Quiz block reads from `window.QUIZ_I18N` with TR fallback. No other JS strings are user-facing. |
| `/index.html` | Inline `<script>window.QUIZ_I18N = {...TR...}</script>` added before `script.js`. `hreflang` + `og:locale:alternate` + switcher markup added. |
| `/en/index.html` | New file. Full EN translation. `../` asset paths. Inline `QUIZ_I18N` with EN copy. Inline products data with EN names. Same `hreflang` block. |
| `sitemap.xml` | Both URLs listed; `xhtml:link` alternates on each. |
| `CLAUDE.md` | Stack and audience sections updated. |

## Alternatives considered

1. **Runtime JS i18n.** Rejected — breaks SEO in a no-build static
   stack. The EN locale would not be reliably indexed because Google's
   crawler would see the TR snapshot before JS hydration.
2. **Build step (Node templater).** Rejected — contradicts the
   foundational "no `package.json`, no framework, no bundler" rule
   from CLAUDE.md. Worth re-opening if a third locale is added or if
   the catalog grows enough to make hand-syncing painful.
3. **EN as default, TR at `/tr/`.** Rejected — brand is Istanbul-based,
   primary market is Turkey, JSON-LD address is Karaköy. Putting EN at
   the root would weaken the brand's local-search signal and feel
   off-brand for the primary market.
4. **`Accept-Language` server-side redirect.** Rejected — adds runtime
   behaviour without commensurate value, and is impossible on GitHub
   Pages staging without an edge function. `x-default` handles the
   search-engine signal cleanly without redirects.
5. **Subdomain split (`tr.sherocosmetic.com` / `en.sherocosmetic.com`).**
   Rejected — adds DNS + cert overhead and splits link-equity between
   subdomains. Sub-folder structure (`/en/`) consolidates SEO authority
   on the apex.

## Related decisions

- [ADR-0001](0001-static-brand-landing-no-ecommerce.md) — Static brand landing, no on-page ecommerce
- [ADR-0009](0009-github-pages-staging-then-cloudflare-pages.md) — GitHub Pages staging, Cloudflare Pages production
- [ADR-0012](0012-legal-pages-as-noindex-drafts.md) — Legal pages ship as noindex draft templates (gates the EN translation of legal pages)
