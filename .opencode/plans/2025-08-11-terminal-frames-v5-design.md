# Terminal Frame Overhaul v5 — Design

**Date:** 2025-08-11

## Goal

Replace CSS border simulation with REAL Unicode box-drawing characters (┌ ┐ └ ┘ ├ ┤ │ ─) forming terminal window frames around every container and section. Section titles live in the top border; sub-items use ├─ ┤ junction borders inside their parent frame.

## Frame System

New shared component `src/components/TerminalFrame/index.tsx` exporting:

- **`TerminalFrame`** — full frame: `┌─ [title] ─fill─┐` top border (title backtick-wrapped, emerald), `│` side edges (vertical-rl writing-mode glyph columns), `└─fill─┘` bottom border. All glyphs `text-emerald-500 dark:text-emerald-400`, `font-mono`, `text-sm`.
- **`TerminalPanel`** — sub-item inside a frame: `├─ [title] ─fill─┤` junction border + padded content.
- **`TerminalSeparator`** — `├─fill─┤` divider row (used in dropdown).

Titles: backtick-wrapped (`` ` about ` ``), `font-semibold`, emerald, `max-w-[55%] truncate`.

## Sections

- **Hero** — `TerminalFrame` (no title) wrapping name/subtitle/badges; badges become bracket tags `[ Available ]`; cubes stay behind.
- **About** — `TerminalFrame title="about"` with 2 `TerminalPanel`s (titles = experience titles, date line + text inside).
- **Education** — `TerminalFrame title="education"` with 1 `TerminalPanel` (course title).
- **Expertise** — `TerminalFrame title="expertise"` with 5 `TerminalPanel`s (capability titles, text + icon strip).
- **Projects** — `TerminalFrame title="projects"` in home page with 4 `TerminalPanel`s (titles = project name + year) containing `ProjectDetail`.

## MenuBar

Full-width terminal title-bar line (fixed top): `┌─ @Aldair Garros:~ ─fill─ EN│BR >_ █ ─┐`.
Dropdown: `TerminalFrame` (no title) with `> `-prefixed item rows and a `TerminalSeparator` above the language row.

## Footer

Full-width bottom line (fixed bottom): `└─ contact: █ ─fill─ links ─fill─ ┘` with pipe-separated links.

## Removals

- `src/components/GlassCard/index.tsx` (all usages converted)
- `src/components/SectionTitle/index.tsx` (titles now in frame borders)
- `src/modules/Sticker/index.tsx` (dead module importing GlassCard)

## A11y

- Decorative glyph rows `aria-hidden` + `select-none`
- `sr-only` h2 per section and sr-only h3 in ProjectDetail (titles hidden inside decorative rows)
- Interactive elements keep existing roles/aria attributes

## Files

1. Create `src/components/TerminalFrame/index.tsx`
2. `src/modules/Hero/index.tsx` — frame + bracket badges
3. `src/modules/About/index.tsx` — frame + panels
4. `src/modules/Education/index.tsx` — frame + panel
5. `src/modules/Expertise/index.tsx` — frame + panels
6. `src/pages/home/index.tsx` — projects frame + panels
7. `src/modules/Projects/ProjectDetail.tsx` — strip title/card, flat content
8. `src/modules/MenuBar/index.tsx` — title-bar line + framed dropdown
9. `src/modules/Contact/index.tsx` — bottom frame line
10. Delete GlassCard, SectionTitle, Sticker
