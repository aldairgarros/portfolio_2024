# Code Reusability & Organization Refactor — Design

**Date:** 2026-08-15
**Status:** Approved

## Goal

Finish the in-flight (uncommitted) refactor of the portfolio codebase by eliminating remaining duplication, removing dead code, and extracting reusable primitives — making future content/structural changes easier. No user-facing behavior or visual changes.

## Context

The current uncommitted work already introduced `Card`, `Section`, and `cn()` (clsx + tailwind-merge). It left behind:

- **2 failing tests** in `Card.test.tsx` (shade classes changed without updating assertions).
- **Dead code:** `ToolPanel` (built + tested but unused — Experiences inlines its own grid), `Chip`, `Card variant="item"`, and unused `Card icon`/`title` props.
- **Duplication:** `itemVariants` × 4, `containerVariants` × 1, `skill_images/${...}` path + `<img>` boilerplate × 4, section-header markup (h3 + mono subtitle + description) × 4, "`>` arrow-list" markup × 2, and per-item `useActiveSection` ref-record wiring × 3.

## Decisions

- **Scope:** finish + de-duplicate the in-flight refactor only. No touching TerminalFrame, BackgroundDecoration, Hero, Contact, MenuBar, Lightbox, ProjectDetail.
- **ToolPanel:** delete (along with its test).
- **Dead Card surface:** remove `Chip`, `variant="item"`, and unused `icon`/`title` props; keep `shade`, `className`, `children`.
- **useSectionRefs hook:** extract to `ActiveSectionContext.tsx` to de-duplicate ref-record wiring; it also removes Expertise's hardcoded capability-id list and its DEV silent-failure warning (map is derived from `expertise.json` at module scope).
- **All user-facing text stays in locales** — no locale file changes expected (removed components were prop-driven).

## Architecture

### New shared files

| File | Exports |
| --- | --- |
| `src/lib/motion.ts` | `fadeUpVariants`, `staggerContainerVariants` (framer-motion variants; replaces 5 copies) |
| `src/lib/assets.ts` | `skillImageSrc(fileName)` → `skill_images/${fileName}` |
| `src/components/SkillIcon/index.tsx` | `SkillIcon({ imageSrc, className?, width?, height? })` — shared `<img alt="" loading="lazy" object-contain>` |
| `src/components/SectionHeader/index.tsx` | `SectionHeader({ title, subtitle?, description? })` — centered h3 + mono subtitle + description |

### Modified files

- `src/components/Card/index.tsx` — strip dead surface; shade map + base classes via `cn()`.
- `src/components/Card/Card.test.tsx` — drop Chip/variant/title/icon tests; fix the 2 stale shade assertions (`soft` → `bg-zinc-50 dark:bg-zinc-950`, `gray` → `bg-zinc-100 dark:bg-zinc-900`).
- `src/context/ActiveSectionContext.tsx` — add `useSectionRefs(paths)`; single `useContext` + `useMemo`, no hooks-in-loop.
- `src/modules/Experiences/index.tsx` — local `ToolItem` interface + `BulletList` helper; use shared pieces.
- `src/modules/Projects/index.tsx`, `src/modules/Credentials/index.tsx` — use `SectionHeader`, `fadeUpVariants`, `useSectionRefs`.
- `src/modules/Expertise/index.tsx` — use `staggerContainerVariants`, `fadeUpVariants`, `SectionHeader`, `useSectionRefs` (module-scope derived map).
- `src/modules/Expertise/Skill.tsx` — use `SkillIcon`.

### Deleted files

- `src/modules/Experiences/ToolPanel.tsx`
- `src/modules/Experiences/ToolPanel.test.tsx`

## Constraints

- `@/` alias for internal imports.
- No hardcoded user-facing strings.
- Code-as-UI aesthetic preserved.
- `useSectionRefs` callers must pass **module-scope (stable) path maps** so the `useMemo` keeps ref identities stable across renders.

## Verification

`npm test` (all green), `npm run typecheck`, `npm run lint`, `npm run build`.
