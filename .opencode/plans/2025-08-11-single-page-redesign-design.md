# Single-Page Portfolio Redesign — Design Spec

**Date:** 2025-08-11
**Status:** Approved
**Approach:** Amplified Glassmorphism (Approach 3)

## Goal

Transform the portfolio from a two-route app (`/` + `/projects/:project`) into a single-page vertical-scroll experience where all project details are visible inline. Amplify the current glassmorphism + code-as-UI aesthetic with bolder typography, gradient accents, larger imagery, and organic decorative elements.

## Section Order

```
Hero > About/Experience > Expertise > Projects (x4 full detail) > Education > Contact
```

## Architecture Changes

### Router (`src/router.tsx`)
- Remove the `/projects/:project` route entirely
- Router becomes single-route only (`/` with hash navigation)
- `Project` import removed

### Removal: `src/pages/project/index.tsx`
- The entire project detail page is deleted
- Its logic extracted into a new reusable component

### New: `src/modules/Projects/ProjectDetail.tsx`
- Extracts full-project display logic (images with lightbox, description card, details card, external link) from the old project page
- Receives `project: string` prop (project key for i18n)
- Used 4 times in the Projects section on the home page

### Removal: `src/modules/Projects/ProjectList.tsx`
- No longer needed -- all projects live on the main page

### Removal: `src/modules/Projects/ProjectCard.tsx`
- No longer needed. ProjectCard was a linking card navigating to `/projects/:project`. Since all details are inline, ProjectDetail renders project content directly using GlassCard (same approach as the old project detail page).

### Home page (`src/pages/home/index.tsx`)
- Import order updated: Hero, About, Expertise, ProjectDetail (x4), Education, Contact
- Each project gets its own `<section id="project-key">` for hash navigation
- MenuBar links updated to include project-specific anchors

### MenuBar / Layout (`src/modules/MenuBar/index.tsx`, `src/pages/Layout.tsx`)
- Replace the horizontal menu bar with a minimal single hamburger button (always visible, not just mobile)
- Full-screen menu overlay (FullScreenMenu.tsx) keeps all links: home, about, expertise, Atalaia Pro, Penhor, Bolso Bom, Musica Show, education, contact
- Language toggle stays in the full-screen menu

## Visual Design System

### Color Accents
- **Primary accent gradient:** amber-to-coral (`from-amber-400 to-rose-400` in light, `from-amber-500 to-rose-500` in dark)
- **Secondary accent gradient:** cyan-to-indigo for variation
- Used for: decorative glows, card border gradients, section divider underlines, hover states
- Current stone accent palette stays for text accents

### Typography
- SectionTitle: `text-5xl sm:text-7xl` (up from `text-4xl sm:text-5xl`)
- Project names within detail: `text-3xl` bold
- All headings remain `font-heading` (Space Grotesk)
- More vertical spacing around section headings (`mb-16`)

### Imagery
- Project image galleries: `grid-cols-2 md:grid-cols-3 gap-4`
- Images have `rounded-2xl` with subtle border
- Lightbox interaction preserved on all gallery images

### Decorations
- **Floating gradient orbs:** CSS-only blobs (`blur-3xl`, `opacity-20`, amber/coral tones) positioned absolutely behind Hero and key sections
- **Scanlines + crosshairs:** BackgroundDecoration component preserved as-is
- **Code brackets:** Preserved in SectionTitle and GlassCard components
- **Gradient section dividers:** A subtle horizontal line with gradient background between major sections

### Glass Cards
- Base: `backdrop-blur-lg bg-white/10 dark:bg-white/5` (unchanged)
- Border: Gradient border via pseudo-element approach (replaces `border-white/20`)
- Radius: `rounded-3xl` (up from `rounded-2xl`)
- Padding: `p-8` (up from `p-6` where applicable)

## Component Changes

### Hero (`src/modules/Hero/index.tsx`)
- Heading: `text-7xl sm:text-9xl`
- Floating gradient orbs behind heading (absolute-positioned blobs)
- Subtitle gets gradient text effect on the name
- "Available" / "AI Ready" badges: gradient borders instead of flat borders
- Parallax scroll + mouse parallax preserved

### About (`src/modules/About/index.tsx`)
- Cards: gradient left-border accent, `rounded-3xl`, `p-8`
- Icons colored with accent gradient

### Expertise (`src/modules/Expertise/index.tsx`)
- Cards: gradient top-border accent
- Skill badges: slightly larger, subtle gradient backgrounds on hover

### Projects -- ProjectDetail (`src/modules/Projects/ProjectDetail.tsx`)
- Full image gallery: `grid grid-cols-2 md:grid-cols-3 gap-4`
- Project name: `text-3xl font-bold font-heading`
- Date: `text-sm font-mono`
- Description + Details: two GlassCards side by side on md using `grid grid-cols-1 md:grid-cols-2 gap-6`
- External link button: gradient border + gradient hover background
- Lightbox: preserved
- Tinted section backgrounds: alternating `bg-accent-500/5` and transparent
- Section `id` matches project key for hash navigation
- No "back to projects" link

### Education (`src/modules/Education/index.tsx`)
- Card: gradient left-border accent, more padding

### Contact (`src/modules/Contact/index.tsx`)
- Message card: gradient left-border
- Contact link buttons: gradient hover background

### SectionTitle (`src/components/SectionTitle/index.tsx`)
- Size: `text-5xl sm:text-7xl`
- Gradient underline bar: `bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400`
- More bottom margin

### BackgroundDecoration (`src/components/BackgroundDecoration/index.tsx`)
- Preserved as-is

## i18n

No locale file changes needed -- all content is already in `en.json`/`br.json`. The `projects.list.*` keys contain all data for full-detail display.

## Implementation Order

1. Create `src/modules/Projects/ProjectDetail.tsx` (extract from `src/pages/project/index.tsx`)
2. Update `src/pages/home/index.tsx` with new section order and ProjectDetail usage
3. Update `src/pages/Layout.tsx` with new SECTIONS list
4. Update `src/modules/MenuBar/index.tsx` with project-specific anchors (if needed)
5. Remove `/projects/:project` route from `src/router.tsx`
6. Delete `src/pages/project/index.tsx`, `src/modules/Projects/ProjectList.tsx`, and `src/modules/Projects/ProjectCard.tsx`
7. Apply visual design changes (globals.css, SectionTitle, GlassCard, Hero, About, Expertise, Contact, Education)
8. Add gradient orbs decoration component
9. Verify: `npm run build` passes
