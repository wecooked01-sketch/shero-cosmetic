# 0010 — Visual identity pivot: apothecary B&W + Manrope

- **Status:** Superseded by [0011](0011-visual-identity-warm-decorative-photography.md) (2026-05-18 — owner pivoted to a warm + decorative + photography-led aesthetic after reviewing the live R1+R2+R3+R4 build)
- **Date:** 2026-05-17

## Y-Statement

In the context of the owner's reset of the brand's visual direction
(B&W palette, modern geometric sans, light/dark mode support, refined
motion), facing the choice between iterating on the warm-rose system
or rebuilding the visual identity from scratch, we decided **for a
full apothecary B&W rebuild (Aesop/Le Labo references) using Manrope
as the sole typeface and dual light/dark theming**, to achieve **a
distinctive minimal aesthetic with built-in dark mode**, accepting
**the loss of the warm-luxe identity, the redraw cost for the SVG
product bottles, and the need to revisit every accent treatment**.

## Context

Previously: warm cream, blush, rose-gold, Playfair Display + Outfit.
Brand voice: "quietly luxurious." Established and well-tuned.

Owner request (verbatim): *"The font selections isn't my favor. I like
more like Poppins or gilroy family. The pink accent isn't good. Choose
black and white accent with white and dark mode support. Work on
better animations. Redesign the UI UX"*

Resolved during this session:
- **Positioning:** apothecary / minimal (Aesop, Le Labo) — vs clinical
  or luxe noir alternatives proposed. The current product copy
  (botanical-leaning, "quietly luxurious") fits apothecary better than
  the alternatives.
- **Font:** Manrope (free, geometric, closest analog to the requested
  Gilroy which is paid at $199+). Single family covers display + body
  via weight variation, which is more elegant for minimal apothecary
  than a serif/sans pairing.
- **Theme:** `prefers-color-scheme` auto + manual override stored in
  `localStorage('shero-theme')`. No-flash inline script applies the
  persisted preference before paint.

## Implementation across R1–R4

This ADR covers R1 (foundation) only. Later batches:

- **R2:** Redraw the three hand-drawn product-bottle SVGs as monochrome
  line-art. Required because the current SVGs hardcode rose-gold +
  blush gradient defs that look out of place in B&W (especially in
  dark mode).
- **R3:** Animation rework — mask-reveal entries instead of opacity+y,
  magnetic CTAs, cursor-follow on hero, sticky scrub on the routine
  5-step.
- **R4:** Section-level UI/UX revisits — hero composition, quiz card
  treatment, testimonial card visual, footer/newsletter polish.

## R1 deliverable detail

### CSS tokens
- New: `--bg`, `--bg-alt`, `--surface`, `--ink`, `--ink-soft`,
  `--ink-mute`, `--line`, `--shadow`, `--shadow-soft`,
  `--bg-translucent`, `--surface-translucent`, `--focus-glow`,
  `--ink-on-dark`.
- Compat aliases: `--cream`, `--cream-deep`, `--blush`, `--blush-soft`,
  `--rose-gold`, `--rose-gold-text`, `--gold`, `--gold-deep`, `--white`
  now resolve to the neutral tokens above. Existing selectors keep
  working; tokens will be renamed in a later cleanup pass.

### Theme system
- Light is default. Dark engages via either `prefers-color-scheme:
  dark` (when user hasn't overridden) OR `<html data-theme="dark">`.
- Manual toggle in header (`#themeToggle`) flips data-theme and
  persists to `localStorage.shero-theme`.
- No-flash inline script runs synchronously before stylesheet, reads
  localStorage, sets `data-theme` before first paint.
- `color-scheme` CSS property set per theme so native form controls /
  scrollbars also adapt.

### Typography
- Manrope variable-weight (200..800), italics included.
- `--font-body` and `--font-display` both = Manrope. The `--font-sans`
  and `--font-serif` aliases preserve backward compatibility.
- `<em>` accents in section titles still get italic emphasis (Manrope
  italic), just no longer serif-distinct.

### Theme-adaptive footer
- Was a hardcoded dark band (`background: var(--ink)`); in dark mode
  that flipped to a light band (broken). Now `background: var(--bg-alt)`
  with a top hairline — flush with the page in both modes, Aesop-style.

### Mobile header
- Hides the non-functional search icon at ≤820px (`.icon-btn--search`)
  so the new theme toggle fits alongside cart + menu inside the
  available width.

### Accessibility preserved
- All Batch 2 work survives: `:focus-visible` rings (now using `--ink`
  which contrasts in both themes), touch-target sizes ≥44×44, reduced-
  motion guards, focus management, ARIA live regions.

## Consequences

**Positive:**
- Distinctive, on-trend brand aesthetic that's coherent with the
  ingredient-led copy.
- Native dark mode — beauty sites that support it are uncommon and
  read as premium.
- Single typeface reduces network cost and visual noise.
- Footer no longer "breaks" in dark mode.

**Negative:**
- Loses the existing rose-gold equity (whatever there was after a
  pre-launch build).
- Three SVG bottles still display rose/blush gradients until R2 lands —
  obvious in dark mode.
- Compat-aliased tokens (`--rose-gold` resolving to `--ink` etc.) are
  semantically weird in source. Cleanup pass needed.

**Reversibility:** Two-way. Tokens are centralized; reverting means
restoring the old `:root` block. SVG redraws in R2 are the one-way
piece — old bottles preserved in git history.

## Confirmation

Light mode and dark mode both verified in browser preview (manual
toggle + persistence). No console errors. Manrope renders. Footer
adapts. Theme toggle's sun/moon icon swaps correctly.
