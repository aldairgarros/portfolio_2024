# Branding System Design

**Date**: 2026-07-28
**Summary**: Complete grayscale branding system for the portfolio — replacing the rose accent with stone, adding missing color aliases, defining shadow/radius/spacing tokens.

## Design Direction

Monochromatic — black, white, and shades of gray. No color accents. The portfolio communicates purely through typography, spacing, and material depth.

## Color System

| Token     | Maps to                   | Role                                                |
| --------- | ------------------------- | --------------------------------------------------- |
| `primary` | **zinc**                  | Everything — backgrounds, text, borders, surfaces   |
| `accent`  | **stone** (replaces rose) | Hover states, section underlines, active indicators |
| `off`     | **neutral**               | Secondary surfaces, background variants             |
| `success` | **green**                 | Future semantic use                                 |
| `warning` | **orange**                | Future semantic use                                 |
| `danger`  | **red**                   | Future semantic use                                 |

The `secondary` (rose) alias is removed entirely. All `secondary-*` references become `accent-*` (stone).

## Typography

Already implemented (Space Grotesk headings + Inter body + JetBrains Mono dates/code). No changes.

## Shadows

| Token         | Value                          | Usage                                  |
| ------------- | ------------------------------ | -------------------------------------- |
| `--shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.04)`  | Skill badges                           |
| `--shadow-md` | `0 2px 8px rgb(0 0 0 / 0.06)`  | GlassCard default (replaces shadow-xl) |
| `--shadow-lg` | `0 4px 16px rgb(0 0 0 / 0.08)` | GlassCard hover (replaces shadow-2xl)  |
| `--shadow-xl` | `0 8px 32px rgb(0 0 0 / 0.10)` | Modals, lightbox                       |

## Border Radius

| Token           | Value     | Usage                         |
| --------------- | --------- | ----------------------------- |
| `--radius-sm`   | `0.25rem` | Small badges                  |
| `--radius-md`   | `0.5rem`  | Buttons                       |
| `--radius-lg`   | `0.75rem` | Skill badges (was rounded-xl) |
| `--radius-xl`   | `1rem`    | GlassCard (was rounded-2xl)   |
| `--radius-2xl`  | `1.5rem`  | Large feature cards           |
| `--radius-full` | `9999px`  | Pills, language toggle        |

## BackgroundDecoration Fixes

1. Define `success`, `warning`, `danger` color aliases
2. Add `absolute` positioning class to blob elements
3. Blobs now render correctly with proper colors

## File Changes

| File                                            | Change                                                                                                                                    |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `src/globals.css`                               | Replace `secondary` (rose) with `accent` (stone); add `off`, `success`, `warning`, `danger` aliases; add shadow tokens; add radius tokens |
| `src/components/SectionTitle/index.tsx`         | `secondary-500` → `accent-500`                                                                                                            |
| `src/components/GlassCard/index.tsx`            | `shadow-xl` → `shadow-md`, `shadow-2xl` → `shadow-lg`                                                                                     |
| `src/components/BackgroundDecoration/index.tsx` | Add `absolute` to blob divs                                                                                                               |
| `src/modules/Education/index.tsx`               | `secondary-*` → `accent-*`                                                                                                                |
| `src/modules/Hero/index.tsx`                    | `secondary-*` → `accent-*`                                                                                                                |
| `src/modules/About/index.tsx`                   | `secondary-*` → `accent-*`                                                                                                                |
| `src/modules/Contact/index.tsx`                 | `secondary-*` → `accent-*`                                                                                                                |
| `src/modules/Projects/ProjectCard.tsx`          | `secondary-*` → `accent-*`                                                                                                                |
| `src/modules/MenuBar/index.tsx`                 | `secondary-*` → `accent-*`                                                                                                                |
| `src/modules/MenuBar/FullScreenMenu.tsx`        | `secondary-*` → `accent-*`                                                                                                                |
| `src/modules/Sticker/index.tsx`                 | `secondary-*` → `accent-*`                                                                                                                |
| `src/pages/project/index.tsx`                   | `secondary-*` → `accent-*`                                                                                                                |
