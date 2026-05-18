# 0013 — Typography rewrite: Fraunces + Manrope, one family per headline

- **Status:** Accepted
- **Date:** 2026-05-18

## Y-Statement

In the context of the owner reviewing the warm-rewrite site and flagging
that "Her kadın kendinin kahramanıdır" and similar headlines mixed two
or three font families/styles inside one title (Manrope-ExtraBold +
Bagel-Fat-One + Manrope-italic-medium, all on one h2), with the brand
voice defined as **clean, science-backed, warmly editorial**, facing the
choice between (a) tightening Bagel Fat One + Manrope into a stricter
scale, (b) unifying everything onto Manrope alone, or (c) replacing
Bagel Fat One with an editorial serif paired with Manrope, we decided
**for an editorial serif (Fraunces) + sans (Manrope) pair**, governed by
the rule that **within a single headline, only one family is used —
variation comes from weight and italic, never from a mid-headline family
swap**, to achieve **typographic consistency that matches the "warmly
editorial" brand voice and removes the visual whiplash of three voices
in one h2**, accepting **the loss of Bagel Fat One's chunky personality
moment, the extra payload of a variable serif, and the audit cost of
sweeping ~40 ad-hoc `font-family` declarations into a coherent scale**.

## Context

Bagel Fat One was loaded as a display font during the warm rewrite
(ADR-0011) and was used in five places via `<span class="display">…</span>`
— each was an inline word inside an otherwise-Manrope headline. The
`em` rule inside `.section-title` independently italicized different
words. The result: a single h2 like

> Her kadın **kendinin** *kahramanıdır.*

painted as Manrope-800 + Bagel-Fat-One-400 + Manrope-italic-500 — three
distinct typographic voices in fifteen syllables. Owner described it as
"feels off / weird," and the rule they articulated was: **if it's
Poppins, it should only be Bold and Regular in one header, no mix with
different fonts**.

This is a real problem, not a taste preference: mid-headline family
swaps break the visual unit a headline is supposed to be. Editorial
type traditions handle "emphasis" via italic (same family) or weight
(same family), not via family change.

## Decision

### Two families, strict roles

| Role | Family | Used by |
|---|---|---|
| **Display** | Fraunces (variable serif, opsz 9–144, weights 400–600, italic 400–500) | `.hero__title`, `.section-title` only |
| **UI/Body** | Manrope (weights 400–700) | `h3` card titles, `.eyebrow`, `.lead`, buttons, captions, paragraphs, forms, micro UI, footer, mobile nav |

`--font-display` is Fraunces. `--font-heading` and `--font-body` are
both Manrope. The `--font-heading` token name is retained to avoid a
sweep across 30+ existing rules; semantically it now means "UI heading
sans" (h3-level and smaller).

### The one-family-per-headline rule

Within a single `<h1>` or `<h2>`:

- **Family is fixed** by the parent rule (`.hero__title` and
  `.section-title` both resolve to `--font-display` = Fraunces).
- **Emphasis is `<em>`** — italic, same family, slightly lower weight,
  softer ink color (`--ink-soft`). The Fraunces italic at opsz 96–144 is
  the natural editorial inflection.
- **The old `.display` class is removed** from markup. All five
  occurrences are migrated to `<em>`.
- **No family swap** is permitted mid-headline. If a future headline
  needs a different feel, change the parent rule (the whole title) —
  don't span-wrap a word in a different family.

### Loading

```html
<link
  href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..600;1,9..144,400..500&family=Manrope:wght@400;500;600;700&display=swap"
  rel="stylesheet" />
```

Fraunces is requested with the `ital` + `opsz` + `wght` axes so the
display sizes get the proper optical-size cut without a separate file
request per weight. Manrope retains the full 400–800 weight range:
even though hero/section titles no longer need 800, the h3-tier UI
heading scale (card titles, stat numbers, eyebrows) keeps `font-weight:
800` for visual heft against body text. Trimming 800 would require
sweeping ~18 declarations down to 700, which is a separate decision —
recorded here as a deliberate non-change.

### Scale tuning

For Fraunces at display sizes:

- `letter-spacing` loosened from `-0.025em` (hero) / `-0.02em`
  (sections) to `-0.015em` / `-0.01em`. Serifs need less negative
  tracking; the previous values were tuned for Manrope's compressed
  counters.
- `line-height` opened slightly: hero 1.02 → 1.05, sections 1.05 →
  1.1. Serif ascenders/descenders read taller.
- `font-weight` dropped from 800 to 500. Fraunces at 500 reads as
  confidently substantial without the heavy-display-serif feel a 700+
  weight would produce.
- `font-variation-settings: 'opsz' 144` (hero) and `'opsz' 96`
  (sections) selects the display optical-size cut.

## Consequences

### Positive

- Single voice per headline. The "three families in one h2" bug is gone.
- The brand voice ("warmly editorial") is now actually editorial in the
  type, not just the copy.
- Fraunces handles Turkish diacritics (ş ğ ı ç İ Ö Ü) cleanly — verified
  in Google Fonts spec sheet; the typeface ships full Latin Extended-A.
- `<em>` is now the canonical headline-emphasis mechanism. Semantic and
  visual unified.
- The .display class no longer needs to exist. One fewer abstraction.

### Negative

- Bagel Fat One's chunky personality is gone. If a future use of the
  brand needs that decorative-flair moment (e.g. a campaign poster), it
  has to be re-introduced with a new ADR.
- Variable font payload is heavier than a single-weight Bagel + 5
  Manrope weights — but `font-display: swap` + the preconnect already
  in place keeps perceived load fast.
- 40-some existing `font-family: var(--font-heading)` declarations were
  not touched; they continue to resolve to Manrope. If future work
  wants the h3-level type also in serif, a follow-up ADR should record
  that — don't drift the token meaning silently.

### Markup migration (recorded for audit)

| File | Line (pre) | Before | After |
|---|---|---|---|
| index.html | 140 | `Her cilt için <span class="display">yeni</span>` | `Her cilt için <em>yeni</em>` |
| index.html | 249 | `Her kadın <span class="display">kendinin</span>` | `Her kadın <em>kendinin</em>` |
| index.html | 391 | `<h2>Cilt bakım <span class="display">ritüeli.</span></h2>` | `<h2>Cilt bakım <em>ritüeli.</em></h2>` |
| index.html | 656 | `Beş adım. Sonsuz <span class="display">parlaklık.</span>` | `Beş adım. Sonsuz <em>parlaklık.</em>` |
| index.html | 761 | `<span class="display">Merhaba</span> de.` | `<em>Merhaba</em> de.` |

## Alternatives considered

1. **Keep Bagel Fat One, fix the scale.** Rejected — the user's pain
   point was specifically that Bagel "feels off." A purely structural
   audit wouldn't address it.
2. **Manrope-only, drop the display family.** Rejected — the brand voice
   wants the editorial register a serif provides. Sans-only would read
   as more clinical / generic.
3. **Bodoni / Playfair / DM Serif Display.** Rejected — high-contrast
   display serifs read as cosmetic-luxury-cliché in this category.
   Fraunces is warmer, more contemporary, and the soft optical-size
   cut at 144 specifically suits editorial display.
4. **Cormorant Garamond.** Rejected — beautiful but more classical /
   wedding-invitation than "warmly editorial." Listed as fallback only.
