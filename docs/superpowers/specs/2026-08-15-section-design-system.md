# Section Design System — Design

**Date:** 2026-08-15
**Status:** Approved

## Goal

Establish a consistent, documented "section anatomy" for all content sections: section titles, headers, contents, and items as reusable components in separated files — so structure is uniform across modules and changes stay local.

## Decisions

- **Scope:** section system only. Hero, MenuBar, Contact, ProjectDetail, Lightbox, BackgroundDecoration are untouched.
- **`SectionItem` owns active-section refs** — supersedes the `useSectionRefs` hook (removed).
- **Expertise keeps its stagger pattern** (parent `staggerContainerVariants`); its items use `SectionItem` with `trigger="inherit"` so animation timing is preserved.
- **No visual or behavior changes** — class strings carried over verbatim into the new primitives.
- All user-facing text stays in locales.

## Vocabulary

All under `src/components/`, one consistent `Section*` family:

| Component        | Role                                                          |
| ---------------- | ------------------------------------------------------------- |
| `Section`        | Outer `<section>` (id, section ref, background), renders `SectionTitle` |
| `SectionTitle`   | The section `h2` heading (extracted from `Section`)           |
| `SectionHeader`  | Item-level `h3` + subtitle + description (`sm`/`lg`)          |
| `SectionContent` | Standardized container (`stack`/`grid` variants)              |
| `SectionItem`    | Animated item wrapper: fade-up + `useActiveSection(path)`; `trigger="scroll"` (default) or `"inherit"` |
| `Card`           | Shade container (`white`/`soft`/`gray`/`green`)               |
| `CardLabel`      | Uppercase card heading (dedupes 4× repeated label markup)     |
| `ArrowList`      | Emerald `>` bullet list (moved from Experiences' local `BulletList`) |
| `SkillIcon`      | Skill image (`skill_images/` path via `skillImageSrc`)        |

Shared libs: `src/lib/motion.ts` (`fadeUpVariants`, `staggerContainerVariants`), `src/lib/assets.ts` (`skillImageSrc`), `src/lib/cn.ts`.

## Module structure

- `Experiences/` → `index.tsx` (Section + map), `ExperienceItem.tsx` (per-experience block), `ToolGrid.tsx` (tools grid), `types.ts` (`ExperienceId`, `EXPERIENCE_LIST`, `EXPERIENCE_PATHS`, `ToolItem`).
- `Projects/`, `Credentials/`, `Expertise/` stay single-file (already concise after adopting primitives; `Projects` delegates to `ProjectDetail.tsx`).

## Removals

- `useSectionRefs` from `src/context/ActiveSectionContext.tsx` (superseded by `SectionItem`).

## Verification

`npm test` (all green), `npm run typecheck`, `npm run lint`, `npm run build`.
