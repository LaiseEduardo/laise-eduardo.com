---
name: laise-eduardo.com
description: A one-page portfolio drawn as an engineering drawing sheet — every claim dimensioned, every claim checked by a link.
colors:
  sheet: "#fbfbf9"
  ink: "#0d1b2a"
  ink-2: "#3a4653"
  rule: "#9aa4ae"
  accent: "#1565c0"
  accent-ink: "#ffffff"
  cell: "#ffffff"
  sheet-dark: "#0f1a2b"
  ink-dark: "#eef2f6"
  ink-2-dark: "#b7c2cf"
  rule-dark: "#5c6b7e"
  accent-dark: "#6fb1ff"
  accent-ink-dark: "#0b1526"
  cell-dark: "#13213a"
typography:
  display:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(3.4rem, 11vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "clamp(1.9rem, 4vw, 2.6rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "0.02em"
  title:
    fontFamily: "Big Shoulders Display, Arial Narrow, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "0.02em"
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  lead:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "0.66rem"
    fontWeight: 700
    lineHeight: 1.55
    letterSpacing: "0.1em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, Menlo, monospace"
    fontSize: "0.875em"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
rounded:
  none: "0"
  bubble: "50%"
spacing:
  gutter: "16px"
  cell: "0.55rem 0.7rem"
  rev-cell: "0.7rem 0.8rem"
  detail: "1.1rem 1.2rem 1.2rem"
  detail-headline: "1.6rem 1.8rem 1.8rem"
  grid-gap: "1.25rem"
  hero-gap: "2rem"
  hero-gap-wide: "3rem"
  section: "2.75rem"
  sheet-pad: "1.75rem 16px 16px"
  sheet-pad-wide: "2.5rem 2.5rem 2rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0.55rem 1rem"
  button-primary-hover:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "0.55rem 1rem"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
  button-address:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1rem"
  title-block:
    backgroundColor: "{colors.cell}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "{spacing.cell}"
  title-block-label:
    backgroundColor: "{colors.cell}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
  detail-card:
    backgroundColor: "{colors.cell}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "{spacing.detail}"
  bubble:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.bubble}"
    size: "2rem"
  bubble-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
  scale-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "0.15rem 0.4rem"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.title}"
    padding: "0.15rem 0"
---

# Design System: laise-eduardo.com

## Overview

**Creative North Star: "The Drawing Sheet"**

The site is a single engineering drawing: a vellum-white sheet inside a double hairline ink frame, zone letters along the border, a title block in the corner, and the candidate herself laid out as a specified part. Headings are section stamps in condensed drafting capitals ("General notes", "Specifications", "Revision history", "Detail views", "Issue for review"). Skills are dimension lines with extension ticks and the group name set on the line; experience is a revision table; projects are detail views with a lettered bubble. Every claim on the sheet terminates in a "checked by" link, and three proof callouts run physical leader lines across the page to the title block.

The world is drawn in one ink on one paper. There is one accent (drafting blue) and it is reserved for the things a draughter marks in colour: hyperlinks, the leader line as it draws itself, text selection, the focus ring. Every interactive state is a one-bit inversion (ink becomes paper, paper becomes ink); nothing fades, glows, lifts or rounds. Density is high but ruled: hairlines, not whitespace, separate regions. Dark mode is a blueprint inversion of the same sheet, not a second palette.

Confirmed rejections: the default developer portfolio (hero, skills grid, three rounded cards), gradients and glows, drop shadows, pill shapes, kickers and eyebrows above headings, decorative icons.

**Key Characteristics:**
- Framed sheet: body padding is the gutter; the frame is a 1px ink border plus a 1px ink outline offset 4px, with mono zone letters A–F (top) and 1–4 (left, desktop only).
- Square everything: radius is 0 everywhere except the circular detail bubble.
- Hairline hierarchy: ink hairlines for structural edges (frame, header, title block, tables, cards); grey hairlines for section dividers and leaders at rest.
- One-bit states: hover and focus swap ink and paper; no colour shift, no shadow, no motion except the leader draw.
- Three faces, three jobs: condensed display capitals for stamps and actions, hyperlegible sans for reading, mono for machine values.

## Colors

One ink on one sheet, with drafting blue as the only marking colour; dark mode inverts the sheet to blueprint navy and lifts the blue so it still reads on it.

### Primary
- **Drafting Blue** (`accent`): hyperlinks in prose and table cells, the leader line as it draws on hover/focus and its end dot, text selection background, the 2px focus ring. It never fills a button and never tints a surface.
- **Blueprint Blue** (`accent-dark`): the same role under `prefers-color-scheme: dark`, lifted for contrast on navy.

### Neutral
- **Vellum** (`sheet`): page background and the paper side of every one-bit inversion (button text on ink, bubble text on hover, the measure label's knock-out behind the dimension line).
- **Drafting Ink** (`ink`): all text, every structural hairline (frame, header rule, title block and table cell borders, card borders, dimension lines and ticks), and the fill of the primary button and inverted states.
- **Annotation Ink** (`ink-2`): secondary text — table headers, the title string, the measure label, callout descriptions, detail descriptions and notes, the footer.
- **Pencil Grey** (`rule`): non-structural hairlines — section dividers, the hero underline, item separators inside a dimension span, leaders at rest and their dot, the scale-tag border, zone letters, the notes dash, the scrollbar thumb.
- **Cell White** (`cell`): the fill of bordered cells — title block, revision table, detail cards — so they sit a hair above the vellum without a shadow.
- **Blueprint** (`sheet-dark`), **Chalk** (`ink-dark`), **Chalk-2** (`ink-2-dark`), **Slate Rule** (`rule-dark`), **Blueprint Cell** (`cell-dark`), **Ink on Blue** (`accent-ink-dark`): the dark scheme, swapped in by `prefers-color-scheme: dark`. Same roles, no new ones.

### Named Rules
**The One Ink Rule.** Buttons, inverted states and structural lines are ink and paper only. Blue marks a link or a live leader; it never fills a surface or a button.

**The Two Hairlines Rule.** Ink hairlines bound things that are "on the sheet" (frame, cells, cards, dimension lines); grey hairlines separate or annotate (section dividers, item ticks, leaders at rest). Do not introduce a third line weight or colour.

**The Daylight Default Rule.** The light sheet is the canonical scene (office, daylight, laptop); dark is a system-driven inversion, never a toggle and never the default. `color-scheme` is declared on both.

## Typography

**Display Font:** Big Shoulders Display (with Arial Narrow, sans-serif) — weights 700 and 900 only.
**Body Font:** Atkinson Hyperlegible (with system-ui, sans-serif) — 400, 700, 400 italic.
**Label/Mono Font:** JetBrains Mono (with ui-monospace, Menlo, monospace) — 400, 600; tabular numerals.

**Character:** Drafting capitals stamped over hyperlegible annotation. Every display setting is uppercase, tightly leaded (0.95) and lightly tracked; the body is set generously (1.55) for a reader skimming under daylight; mono is the plotter's typewriter for anything a machine would have written.

### Hierarchy
- **Display** (900, `clamp(3.4rem, 11vw, 6rem)`, 0.95, uppercase, 0.01em): the name on the sheet, and the "404" on the error sheet. One per page.
- **Headline** (700, `clamp(1.9rem, 4vw, 2.6rem)`, 0.95, uppercase, 0.02em): section stamps (h2). The headline detail's h3 steps up to 2.6rem on desktop.
- **Title** (700, 1.6rem, 0.95, uppercase, 0.02em): detail h3; the proof callout value is the same size at 900. Nav links (1rem / 1.05rem desktop), buttons (1.1rem) and detail links (1.05rem) are the same face at 700 with 0.06em tracking.
- **Lead** (400, 1.25rem, 1.45, max 36ch): the pitch under the name and the contact invitation.
- **Body** (400, 1.0625rem, 1.55): prose at max 68ch, table cells (0.95rem in the title block), dimension span items (1.05rem), detail descriptions (max 60ch, annotation ink).
- **Label** (700, 0.66–0.8rem, 0.1–0.12em, uppercase, body face): table headers (0.66rem), the scale tag (0.66rem), the measure on a dimension line (0.7rem, 0.12em), the brand mark (0.72rem), the title string under the name (0.8rem). Always annotation ink or ink; never the display face.
- **Mono** (400, 0.875em of context, tabular): rev dates, sheet numbers, revision letters and periods, zone letters (0.7rem, 0.08em), detail bubbles (0.8rem), the skip link, and the contact address button (0.95rem, no uppercase).

### Named Rules
**The Machine Values Rule.** Mono is for values a machine or a plotter would write — dates, counts, sheet and revision numbers, zone and detail letters, an email address. It is never used for prose, headings or labels.

**The No Kicker Rule.** Nothing sits above a heading. Hierarchy is a stamp followed by its content; the title string under the name is a dimension string drawn beneath, not an eyebrow above.

**The Stamp Rule.** The display face is always uppercase and always 700 or 900. It appears only on headings, nav, buttons, detail links and the callout value; it never sets a paragraph.

## Layout

The body carries the 16px gutter; inside it the `.sheet` frame is `min-height: calc(100vh - 2 × gutter)` and padded `1.75rem 16px 16px` (mobile) or `2.5rem 2.5rem 2rem` (≥48rem). Zone letters sit in the frame's margin; the left column appears only at ≥48rem.

Two breakpoints: **48rem** (details become a 3-column grid with the headline detail spanning all columns; the revision table regains its header row; contact becomes `1fr auto`; left zones appear) and **64rem** (the hero becomes `1.3fr 1fr` aligned to the end so the title block sits bottom-right; callout leaders appear and the callouts list over-reaches `-3rem` into the grid gap so leaders touch the title block; the title block returns to a real 4-column table). Below 64rem the title block reflows to a stacked `max-content 1fr` grid of label/value rows with inner borders collapsed; below 48rem the revision table hides its head and each row becomes a `auto 1fr` grid.

Vertical rhythm is section-based: each main section is padded 2.75rem top and bottom and closed by a grey hairline; the header rule is ink with 2rem below. Grids use 1.25rem (details, contact), 1.6rem (between dimension rows), 2rem/3rem (hero). Cell padding is `0.55rem 0.7rem` in the title block and `0.7rem 0.8rem` in the revision table. Reading measures are 36ch (lead), 60ch (detail description), 68ch (prose). Minimum supported width is 360px.

## Elevation & Depth

No shadows anywhere. Depth is conveyed by the two hairline weights and by `cell` white sitting on vellum: a bordered cell is "on the sheet"; the sheet is the floor. The frame's double line (border + offset outline) is the only layered edge. Hover and focus do not lift: they invert.

### Named Rules
**The Flat Sheet Rule.** No `box-shadow`, no `backdrop-filter`, no gradient, no translucent overlay. If something needs to stand out, it gets an ink border or an ink fill.

## Shapes

Everything is square (radius 0): the frame, cells, cards, buttons, the scale tag, the skip link. The single exception is the detail bubble, a 2rem circle with a 1px ink border, which reads as a drawing's detail callout. Recurring geometry is the hairline device: extension ticks (1px × 9–11px) at the ends of the title string and dimension lines; vertical 1px ticks between items in a span; a 7px dot terminating each leader; the `— ` dash prefix on notes. Lines are always 1px; the only 2px lines are the nav underline, the link hover underline and the focus ring.

## Components

### Buttons
Buttons are stamped actions in drafting capitals, ink-outlined, and flip to solid ink on touch.
- **Shape:** square (0), 1px ink border, `line-height: 1`.
- **Primary:** solid ink on vellum text, padding `0.55rem 1rem`, display face 700 1.1rem uppercase 0.06em. Appears once in the title block ("Email Laise").
- **Secondary:** transparent with ink border and ink text, same metrics ("View projects").
- **Address:** the contact-section variant sets the primary button in mono 0.95rem, no uppercase, no tracking, padding `0.75rem 1rem`, so the email address reads as a machine value.
- **Hover / Focus:** one-bit inversion over 0.15s (`background-color, color`); primary goes paper-on-ink → ink-on-paper, secondary the reverse. Focus-visible gets the global 2px accent outline, offset 3px.

### Title Block
The sheet's signature: a bordered table on cell white, every cell 1px ink. Row headers are labels (0.66rem 700 0.1em uppercase, annotation ink, width 1%, nowrap). Values are body 0.95rem; Rev and Sheet are mono. The last row holds the action pair. Below 64rem it stacks into label/value rows with left/top borders collapsed so it still reads as one block.

### Callouts with Leaders
Three proof lines: a 900-weight display value (1.6rem, uppercase) beside an annotation-ink description, with a 1px grey leader running to the title block and ending in a 7px grey dot. On hover or focus-visible of the link, an accent overlay draws along the leader from the left (`transform: scaleX(0→1)`, 0.55s, `cubic-bezier(0.16, 1, 0.3, 1)`) and the dot turns accent after 0.2s/0.3s delay; the description darkens to ink. Leaders render only at ≥64rem and are suppressed under `prefers-reduced-motion`.

### Dimension Lines (Specifications)
Each skill group is a `dim-row`: a wrapped span of items (1.05rem) separated by 1px grey ticks, with the dimension line beneath — 1px ink line, 11px ink extension ticks at both ends, and the group name as a `measure` label (0.7rem 700 0.12em uppercase, annotation ink) knocked out of the line on a vellum background. Rows are 1.6rem apart.

### Revision Table (Experience)
A bordered table on cell white, 1px ink cells, padding `0.7rem 0.8rem`. Header labels are 0.66rem uppercase annotation ink. Rev letters run backwards (newest is the highest letter) and periods are mono nowrap. Each row's description is a bold role · company line followed by a plain bulleted list. Below 48rem the header is visually hidden and rows become `auto 1fr` grids.

### Detail Views (Projects)
Cards are `cell` white with a 1px ink border, padding `1.1rem 1.2rem 1.2rem`, vertical flex with 0.8rem gaps. The head row is bubble + h3 (1.6rem) + scale tag; then an annotation-ink description, a `notes` list of dash-prefixed tags (0.85rem), and display-face links pushed to the bottom. The first card is the **headline** detail: full-width, padded `1.6rem 1.8rem 1.8rem`, 2-column grid at ≥48rem, h3 at 2.6rem, description at 1.2rem in full ink, links aligned bottom-right. Hover or focus-within fills the bubble ink-on-paper → paper-on-ink.
- **Bubble:** 2rem circle, 1px ink border, mono 0.8rem letter.
- **Scale tag:** label text (0.66rem) inside a 1px grey border, padding `0.15rem 0.4rem`; reads "Live" or "Source".

### Navigation
A baseline-aligned header row closed by a 1px ink rule (0.6rem padding below, 2rem margin below). The brand mark is a body-face label (0.72rem 700 0.1em uppercase). Section links are display face 700 uppercase 0.06em, 1rem (1.05rem ≥48rem), 1rem gaps (1.5rem ≥48rem), with a 2px transparent bottom border that turns ink on hover and focus-visible (outline suppressed in favour of the underline). Wraps naturally on narrow sheets; no hamburger. A mono skip link drops in from above the frame on focus.

### Footer
A 1px ink top rule, 0.75rem padding, body face 0.78rem annotation ink, links in accent.

### Links
Accent, always underlined (1px, offset 0.18em); the underline thickens to 2px on hover. Detail-card links are the display face in uppercase.

## Do's and Don'ts

### Do:
- **Do** frame every page in the sheet: 16px gutter, 1px ink border plus a 1px ink outline offset 4px, mono zone letters in the margin.
- **Do** express every interactive state as a one-bit inversion between `ink` and `sheet`, transitioned in 0.15s at most.
- **Do** bound on-sheet objects (cells, cards, title block, dimension lines) with 1px ink hairlines, and separate or annotate with 1px `rule` grey.
- **Do** set every heading, nav link, button and callout value in Big Shoulders Display, uppercase, 700 or 900.
- **Do** set dates, counts, sheet/rev numbers, zone and detail letters and the email address in JetBrains Mono with tabular numerals.
- **Do** reserve drafting blue for links, the drawn leader and its dot, selection and the focus ring.
- **Do** keep reading measures at 36ch (lead), 60ch (card description) and 68ch (prose).
- **Do** keep the light sheet as the default and let `prefers-color-scheme: dark` swap in the blueprint set; honour `prefers-reduced-motion` by removing the leader draw.

### Don't:
- **Don't** put a kicker, eyebrow or category label above a heading; the only secondary string near a heading is the dimension string drawn beneath the name.
- **Don't** use `box-shadow`, gradients, glows, blur or translucent overlays; depth is hairlines and cell white only.
- **Don't** round corners on anything except the 2rem detail bubble; no pills, no `rounded-lg` cards.
- **Don't** fill a button or a surface with the accent, and don't introduce a second accent.
- **Don't** set prose, labels or headings in the mono face, and don't set paragraphs in the display face.
- **Don't** add icons, pictograms or glyph fonts; the world's marks are lines, ticks, dots and letters.
- **Don't** add a theme toggle or make dark the default; the scene is daylight.
- **Don't** invent a third line weight: 1px for every hairline, 2px only for the nav underline, link hover underline and focus ring.
