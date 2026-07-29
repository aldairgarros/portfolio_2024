# Branding System Implementation Plan

**Goal:** Replace rose secondary with stone accent, add missing color aliases, define shadow/radius tokens.

**Architecture:** globals.css defines all design tokens; all component files use a find-and-replace rename (secondary → accent). GlassCard and BackgroundDecoration get targeted fixes.

## Global Constraints

- tsc -b && vite build must pass with no errors
- noUnusedLocals and noUnusedParameters enabled
- All paths use @/ alias

---

### Task 1: globals.css — Complete Token Redesign

Replace the current `secondary` (rose) palette with `accent` (stone), add `off`/`success`/`warning`/`danger` aliases, add shadow and radius tokens.

### Task 2: Find-and-Replace secondary-* → accent-* Across All Components

Replace all instances of `secondary-` (in class names and CSS) with `accent-` across all .tsx files.

### Task 3: GlassCard Shadow Updates + BackgroundDecoration Fix

GlassCard: `shadow-xl` default → `shadow-md`, `shadow-2xl` hover → `shadow-lg`
BackgroundDecoration: Add `absolute` class to blob inner divs

### Task 4: Verify

npm run lint && npm run build
