# SHERO COSMETIC — Brand Landing

A static product-display landing page for the SHERO Cosmetic skincare brand.

## Run locally

```bash
python3 -m http.server 5173
# then open http://localhost:5173
```

(VS Code users: there's a launch configuration at `.claude/launch.json`.)

## Structure

```
index.html       Single-page markup
styles.css       Styling + CSS custom properties for the palette
script.js        Slider, quiz, reveal animations, mobile nav, testimonials
data/
  products.json  Canonical product list
docs/decisions/  Architecture decision records
.ai/             Session memory for AI-assisted development
```

## Stack

Plain HTML / CSS / JS. GSAP + ScrollTrigger from jsDelivr CDN
(integrity-checked). No framework, no bundler.

## Status

Mid-build, Phase 0 (foundation) complete. See `.ai/milestones.md` for the
phase tracker and `docs/decisions/README.md` for architectural decisions.
