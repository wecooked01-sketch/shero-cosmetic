# 0011 — Visual identity pivot #2: warm + decorative + photography-led

- **Status:** Accepted (foundation lands first; sections follow as separate blocks)
- **Date:** 2026-05-18
- **Supersedes:** [0010 — apothecary B&W + Manrope](0010-visual-identity-apothecary-bw-manrope.md)

## Y-Statement

In the context of the owner's review of the live apothecary B&W site
("current design is not good"), with the reference of a warm, decorative,
photography-led skincare landing the owner shared as the target feel,
facing the choice between iterating on apothecary B&W vs. a full
aesthetic pivot, we decided **for a full rewrite to a warm + decorative +
photography-led aesthetic with color accents, chunky display typography,
and real product/lifestyle imagery**, to achieve **a richer, more
emotionally-warm brand feel that matches what the owner actually wants**,
accepting **the loss of the apothecary B&W system, the asset dependency on
photography the owner will supply, and the time cost of rebuilding every
section's markup and styles**.

## Context

The owner approved the apothecary B&W direction (ADR-0010) earlier in
the day and we shipped R1+R2+R3+R4 to staging. Same evening, the owner
reviewed the live site and asked for a full rewrite, sharing a reference
of a warm/decorative skincare site as the new target.

Reference characteristics extracted from the shared image:
- Warm off-white background with rich visual decoration
- Scattered botanical PNG cutouts (leaves, flowers, dried botanicals)
  arranged around content blocks
- Real product and lifestyle photography (model holding product,
  bottles in environmental settings — rocks, forest, sand)
- Color accents: orange CTA buttons, pops of red/yellow florals
- Two-font system: chunky/groovy display font for logo + heavy bold
  sans-serif for section headings + utility sans for body
- Rounded card containers with soft shadows
- Editorial split layouts (display text left, product imagery right)
- Trust-indicator rows ("Intentionally Made / Gentle Formulas / For All
  Skin Types") with circular icon cards
- Big watermark text behind product imagery as decoration

## Decisions resolved this session

- **Aesthetic:** the WHOLE new direction (not just elements). Apothecary
  B&W is retired; warm + decorative + photographic replaces it.
- **Asset strategy:** the owner will supply product photos, model/lifestyle
  shots, and botanical PNG cutouts. The rewrite leaves placeholder
  rectangles with `data-asset` slot attributes so assets can be dropped
  in by filename without code changes.
- **Structure:** keep all 8 existing sections + add 2 new (full product
  grid, lab/clinical results). Final page order:
  Hero → Press → About → Ingredients → Product grid → Lab → Quiz →
  Routine → Testimonials → Contact → Footer.
- **Working approach:** rewrite in place, commit per block (foundation,
  sections 1–4, sections 5–7, sections 8–11). Each commit pushes to
  staging so the owner can validate progressively.

## Implementation plan

### Foundation block (this commit)
- New CSS token system tuned for warm + decorative:
  - Surfaces: warm cream, warm sand (alt), white (card surface).
  - Ink: deep near-black for body, warm grey for secondary.
  - Accents: a single accent (orange/terracotta) for CTAs + highlights.
- Two-font system:
  - Display: a chunky groovy revival sans-serif (e.g. Bagel Fat One)
    used for the logo and decorative typographic moments.
  - Headlines: a heavy bold sans-serif (Manrope ExtraBold or similar)
    for section titles.
  - Body: Manrope regular/medium (kept from the previous foundation).
- Decoration system: a `.decor` primitive with `data-asset` slots for
  PNG cutouts; in the interim, an inline SVG placeholder set illustrates
  the layout so sections don't render empty.
- Soft-card primitive (`.surface-card`) for the rounded section
  containers visible in the reference.
- Trust-indicator pill row primitive.
- Dark mode retained but de-emphasized — light is the canonical mode
  for this aesthetic. Dark mode will be a darker warm-charcoal variant,
  not pure black.

### Sections blocks (subsequent commits)
- Block 2: Hero, Press, About, Ingredients
- Block 3: Product grid (new), Lab (new), Quiz
- Block 4: Routine, Testimonials, Contact, Footer

## Consequences

**Positive:**
- Aesthetic now matches the reference the owner pointed at — emotional
  fit between brand and visual.
- Photography-led layouts give the site a premium DTC feel that flat
  SVG bottles can't.
- The new section order (with product grid and lab additions) gives
  visitors more browseable / proof-driven paths to conversion.

**Negative:**
- All work behind ADR-0010 (R1–R4) is functionally retired. Tokens,
  bottle SVGs, animation system, and apothecary section treatments
  all get replaced. Git history preserves them for reference.
- Hard dependency on the owner producing photography and decorative
  PNGs before the site can ship to production. Placeholder rectangles
  are clearly marked but the staging review will be mocked-up only.
- More moving parts: color accents, decoration overlays, two-font
  system, photography, soft-card backgrounds. Each new axis is a place
  the design can drift if not constrained.

**Reversibility:** One-way for the visible site (apothecary is replaced),
two-way at the code level (git history). If this direction also doesn't
land, an ADR-0012 supersedes this one.

## Confirmation

To be added per phase as commits land on staging. Foundation commit will
verify: tokens load, fonts load, placeholders render at correct sizes,
trust-indicator row composes correctly, soft-card primitive matches the
reference's corner radius and shadow.
