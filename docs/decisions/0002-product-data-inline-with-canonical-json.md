# 0002 — Product data: canonical JSON file + inline embed

- **Status:** Accepted
- **Date:** 2026-05-17

## Y-Statement

In the context of the quiz needing product data and the routine
section listing products, facing the choice between hardcoding
product objects inside `script.js` vs. extracting to a fetched
JSON file vs. embedding JSON inline in HTML, we decided **for
a canonical `data/products.json` plus an inline
`<script type="application/json" id="shero-products">` embed
in `index.html`**, to achieve **a single human-editable source of
truth that is also runtime-safe under any protocol (no CORS
issues under `file://`)**, accepting **manual two-file sync until
a build step is added**.

## Context

Previously product data was scattered across:
- `script.js` `products` object (used by `renderQuizResult`)
- `index.html` routine section (hardcoded markup)
- `index.html` hero slides (hardcoded markup with SVGs)

That fragmentation is fine while the catalog is tiny (6 SKUs),
but it puts a friction tax on every update and makes future
commerce wiring more expensive.

The cleanest decoupling — fetch from `data/products.json` at
runtime — breaks under `file://` (CORS blocks `fetch`) and
forces all dev to go through a local server, which is a
trip hazard.

## Options considered

1. **Canonical JSON file + inline embed** *(chosen)*
   - Source of truth: `data/products.json`
   - Runtime read: `JSON.parse(document.getElementById('shero-products').textContent)`
   - Hand-synced until a build step justifies automation.
2. Hardcoded in `script.js` (status quo)
   - Cheapest, but doesn't help future commerce migration.
3. `fetch('/data/products.json')` only
   - Cleanest decoupling, but breaks under `file://`.
4. JSON file + a tiny build script that injects the inline copy
   - Best long-term, but premature for 6 SKUs.

## Consequences

**Positive:**
- One file (`data/products.json`) to edit when product info
  changes. The inline block in `index.html` is a mechanical mirror.
- Future commerce integration (Shopify Storefront API, Sanity,
  whatever) has an obvious slot to plug into — the inline embed
  becomes server-rendered, or the JSON file is replaced by an
  API call at build time.
- Works under `file://`, `http://localhost`, and any production host.

**Negative:**
- Two places to keep in sync. If they drift, the quiz and the
  visible routine markup will reference different data. Mitigation:
  6 products, low churn; build script in the backlog.

**Reversibility:** Fully two-way. The JSON file is a static
artifact and can be deleted or replaced without breaking anything,
provided the inline embed stays canonical.

## Confirmation

The quiz result section is wired exclusively through the inline
embed. If the embed is missing or malformed, `renderQuizResult`
should fail gracefully (logged warning, no crash). Verified
manually during Phase 0 smoke test.
