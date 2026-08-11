# Terminal Portfolio Redesign v3 — Design Spec

**Date:** 2025-08-11
**Status:** Approved

## Goal

Apply a full terminal aesthetic: squared edges on every element, terminal command output motifs, grouped projects under a single "Projects" section with menu sub-items, a dropdown menu (replacing the full-screen overlay), and a `@...:~` terminal prompt in the menubar.

## Aesthetic

- **Full squared edges** — `rounded-none` on every element: GlassCard, buttons, pills, badges, images, thumbnails, link buttons, language toggle, menu dropdown
- **Terminal command output motif** — monospace UI chrome, `> ` prefix on menu items, `@...:~` prompt in navbar, solid colors (no gradients)
- **Palette:** Emerald accent + zinc/neutral primaries (unchanged from v2)

## MenuBar Redesign

- **Left:** `@...:~ Aldair Garros` — `@...:~` in `font-mono text-emerald-500`, name in `font-heading`. Click scrolls to `#hero`.
- **Right:** Square EN/BR toggle (`rounded-none`, emerald active) + terminal menu button `@...:~ █` (square, blinking cursor `█` when closed)
- **Dropdown:** Replaces `FullScreenMenu.tsx` (deleted). Positioned `absolute right-0` below button. Glass background (`backdrop-blur-lg bg-primary-900/95 dark:bg-primary-900/95`), square border. Items in `font-mono` with `> ` prefix and indented sub-items. Emerald hover. Closes on item click. Language toggle also inside dropdown.

### Menu Links (matches page order)

```
> about
> expertise
> projects
  > Atalaia Pro
  > Penhor
  > Bolso Bom
  > Musica Show
> education
> contact
────────────────
en │ br
```

## Layout.tsx

- Sections: `["about", "expertise", "projects", "education", "contact"]`
- Projects is a single entry with sub-items for each project key (atalaiaPro, penhor, bolsobom, musicaShow)
- Links structure supports nesting: `{ label, hash, children?: { label, hash }[] }`

## Home Page

- Section order unchanged: Hero > About > Expertise > Projects > Education > Contact
- Projects: wrap 4 ProjectDetail in `<section id="projects">` with a single SectionTitle
- Separators between projects: `border-t border-zinc-200/30 dark:border-zinc-700/20 mt-16 pt-16` on all but the first

## ProjectDetail

- Remove outer `<section id={project}>` wrapper
- Keep inner container with `id={project}` (a plain div) for sub-item hash navigation
- `flip` prop preserved for alternating layout
- Square corners: card `rounded-none`, images `rounded-none`, thumbnails `rounded-none`, link button `rounded-none`

## System-Wide Changes

- **GlassCard:** `rounded-2xl` → `rounded-none`; `shadow-lg dark:shadow-[0_0_30px_rgba(5,150,105,0.05)]` → `shadow-md` (no emerald glow)
- **SectionTitle:** underline `bg-gradient-to-r from-emerald-400 to-emerald-600` → `bg-emerald-400` (solid)
- **Hero:** badges `rounded-none` via className
- **Contact:** link buttons `rounded-full` → `rounded-none`
- **Education, About, Expertise:** inherit GlassCard square corners

## Removals

- `src/modules/MenuBar/FullScreenMenu.tsx` — deleted (replaced by inline dropdown in MenuBar)

## Files to Touch

1. `src/components/GlassCard/index.tsx`
2. `src/components/SectionTitle/index.tsx`
3. `src/modules/Projects/ProjectDetail.tsx`
4. `src/modules/MenuBar/index.tsx` (major rewrite + local dropdown)
5. `src/pages/Layout.tsx`
6. `src/pages/home/index.tsx`
7. `src/modules/Hero/index.tsx`
8. `src/modules/Contact/index.tsx`

**Deletion:** `src/modules/MenuBar/FullScreenMenu.tsx`
