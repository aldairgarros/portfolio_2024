# Full Terminal Portfolio v4 — Design Spec

**Date:** 2025-08-11
**Status:** Approved

## Goal

Push the portfolio fully into a terminal aesthetic: monospace everywhere (no heading font), backtick-wrapped markdown-style titles, CSS terminal-frame borders on all containers, a more visible hero cube set, an `@Aldair Garros:~` prompt with `>_` menu button, and a fixed single-line contact footer.

## 1. Full Monospace Typography

- Remove all `font-heading` (Space Grotesk) usage
- Remove all `font-sans` (Inter) from root/body
- Every text element uses `font-mono` (JetBrains Mono)
- `src/globals.css` root font-family: `"JetBrains Mono", ui-monospace, monospace`
- All headings, body text, UI chrome: `font-mono`
- `--font-heading` variable may remain but must not be used in components

## 2. Backtick-Wrapped Titles

- `SectionTitle` renders the title wrapped in backticks: `` ` Title ` ``
- Backtick glyphs in `text-emerald-400`
- Solid emerald underline bar stays beneath
- Markdown inline-code look: `` ` about ` ``, `` ` education ` ``, `` ` Atalaia Pro ` ``

## 3. CSS Terminal Frame Borders

Every container gets a terminal-window frame via pure CSS borders:
`border border-zinc-200/30 dark:border-zinc-700/20 border-t-2 border-t-zinc-400/50 dark:border-t-zinc-600/50`

- GlassCard base classes
- ProjectDetail card div
- MenuBar nav bar
- Contact footer
- Result: containers look like terminal windows with a title-bar-style thicker top edge

## 4. Hero Cubes — More Visible

| Property | Before | After |
|----------|--------|-------|
| Cube 1 size | 80px | 140px |
| Cube 2 size | 110px | 180px |
| Opacity | `opacity-20` | `opacity-40` |
| Blur | `blur-[1px]` | none |
| Border color | `rgb(16 185 129 / 0.4)` | `rgb(16 185 129 / 0.55)` |
| Face fill | `rgb(16 185 129 / 0.04)` | `rgb(16 185 129 / 0.08)` |
| Mobile visibility | `hidden sm:block` | keep |

## 5. Menubar Prompt + Button

- Left prompt: `@Aldair Garros:~` (emerald, font-mono)
- Menu toggle button: `>_` + blinking `█` cursor (emerald, font-mono)

## 6. Contact — Fixed Sticky Footer

- Rewrite `src/modules/Contact/index.tsx` to export `ContactFooter`
- Rendered in `src/pages/Layout.tsx` outside the Outlet, `fixed bottom-0 z-20`
- Single horizontal row: email, phone, whatsapp, linkedin, github with `|` pipe separators
- Icons + compact text, `font-mono`
- Terminal frame border (thicker top edge)
- Home page: remove `<Contact />` from stack, add `pb-14` on main for footer clearance

## Files

1. `src/globals.css` — root font mono
2. `src/components/GlassCard/index.tsx` — terminal frame border
3. `src/components/SectionTitle/index.tsx` — backtick titles
4. `src/modules/Hero/index.tsx` — cube visibility
5. `src/modules/MenuBar/index.tsx` — prompt + button
6. `src/modules/Contact/index.tsx` — rewrite as ContactFooter
7. `src/modules/Projects/ProjectDetail.tsx` — terminal frame border on card
8. `src/pages/Layout.tsx` — include ContactFooter
9. `src/pages/home/index.tsx` — remove Contact, pb-14

No structural/route changes.
