# Terminal-Professional Portfolio Redesign v2 — Design Spec

**Date:** 2025-08-11
**Status:** Approved (full design presented section-by-section, user approved all)

## Goal

Replace the amber/rose "amplified glassmorphism" aesthetic with a vibrant emerald-green + gray terminal-professional design. Restructure the menu (terminal prompt icon, always-visible language selector, name label), replace hero gradient orbs with CSS 3D cubes, replace colored-bordered cards with shadowed glass, redesign Expertise into a vertical layout with a mounted icon strip, and redesign Projects into single unified blocks with image + text side by side.

## Palette

- **Primary:** Zinc/neutral grays (surfaces, text) — unchanged base
- **Accent:** Emerald green (`emerald-400`–`emerald-600`) for borders, icons, links, glows
- **Removed:** All amber, rose, stone decorative references

## Section Order (unchanged)

```
Hero > About > Expertise > Projects (x4) > Education > Contact
```

## MenuBar Redesign

```
Desktop:  >_ Aldair Garros                    EN | BR | (menu button)
Mobile:   >_ Aldair Garros                          (menu button)
```

- **Left:** Terminal prompt icon (`>_`, `ChevronRight` + `Underscore` lucide icons) + person's name (`hero.title.value` = "Aldair Garros"). Clicking name scrolls to `#hero`.
- **Right (always visible):** Language toggle EN/BR — pill-shaped (`rounded-full`), emerald active state, always visible on desktop AND mobile.
- **Menu button:** Terminal-prompt creative button (`>_` styled element, blinking cursor effect) opens the full-screen overlay. Replaces hamburger.
- **Full-screen overlay** (`FullScreenMenu.tsx`): dark glass `bg-primary-900/95`, emerald-tinted links, links list: about, expertise, atalaiaPro, penhor, bolsobom, musicaShow, education, contact. Language selector also present inside overlay.
- Menu label keys: add `home.menuOpen`/`home.menuClose` already exist; rename usage appropriately. New: no "home" link — name label replaces it.
- Glassify the bar: `backdrop-blur-lg bg-white/10 dark:bg-white/5 border-b border-zinc-200/30 dark:border-zinc-700/20`.

## Hero

- **Replace gradient orbs with two CSS 3D cubes** (no three.js, no new deps):
  - Each cube: 6 faces (`transform-style: preserve-3d`), emerald wireframe borders (`rgba(5,150,105,0.3)`), near-transparent emerald fill
  - Framer Motion drives `rotateX`/`rotateY` — cube 1 slow Y rotation, cube 2 combined X+Y rotation
  - Positioned `absolute` behind hero text, `blur-sm`, `opacity-20`, `pointer-events-none`
- Heading: `text-7xl sm:text-9xl` (kept)
- Badges: emerald `border-emerald-400/40` borders
- Keep scroll parallax + mouse parallax
- `overflow-hidden` on section (kept)

## GlassCard (container redesign)

- Border: `border border-zinc-200/30 dark:border-zinc-700/20` — neutral, subtle
- No gradient pseudo-element borders, no amber/rose borders
- Padding: `p-6`
- Radius: `rounded-2xl`
- Shadow: `shadow-lg` in light mode; dark mode `shadow-[0_0_30px_rgba(5,150,105,0.05)]` subtle emerald glow
- Keep `backdrop-blur-lg bg-white/10 dark:bg-white/5`
- Keep hover/tilt behavior

## SectionTitle

- Size: `text-4xl sm:text-5xl` (tightened from 7xl for professional feel)
- Underline: `bg-gradient-to-r from-emerald-400 to-emerald-600`
- Icons: `text-emerald-400`

## Expertise

- Vertical layout — each capability is a block stacked vertically (no 2-col grid)
- Title + context/applicability/impact text stacked
- **Tech icons as mounted strip**: one horizontal `flex flex-wrap` row per capability, icons at `w-12 h-12`, **no background card** behind each icon (remove the `bg-white/10 border` wrapper), grayscale by default → full color on hover
- Subtle `border-zinc-200/30` divider between capabilities
- No colored top borders on expertise cards

## Projects (ProjectDetail)

- Single unified block per project:
  - Card: GlassCard styling (neutral border, shadow)
  - **Left half:** main project image (`t("image.src")`) — `object-contain`, padded
  - **Right half:** project name (`text-2xl font-bold font-heading`), date (`font-mono text-sm`), description + details merged as flowing text, emerald link button, compact thumbnail row
  - **Alternating:** even projects flip — image right, text left (`md:order-*`)
- Lightbox on main image + thumbnails
- Link button: `border-emerald-400/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white`
- Thumbnails: `grid grid-cols-2 md:grid-cols-4` small, click opens lightbox
- No alternating tinted backgrounds (shadows/glass handle separation)

## Education, About, Contact

- `border-l-amber-400/60` → `border-l-emerald-400/40`
- Amber icons → `text-emerald-400`
- Contact links: `hover:bg-emerald-500`, focus rings `focus:ring-emerald-400`
- Contact message card: emerald left border
- Same layouts otherwise

## globals.css

- Remove amber/rose decorative CSS
- Add emerald accent variables if needed (use Tailwind emerald palette directly)

## Files to Touch

- `src/modules/Hero/index.tsx` — CSS cubes, emerald badges
- `src/modules/MenuBar/index.tsx` — terminal icon button, always-visible lang toggle
- `src/modules/MenuBar/FullScreenMenu.tsx` — emerald tint, remove language from being only place
- `src/pages/Layout.tsx` — SECTIONS labels (name replaces home)
- `src/components/GlassCard/index.tsx` — neutral border, emerald glow shadow
- `src/components/SectionTitle/index.tsx` — emerald underline, tighter type
- `src/modules/Expertise/index.tsx` — vertical layout, icon strip
- `src/modules/Expertise/Skill.tsx` — icon without background, grayscale→color
- `src/modules/Projects/ProjectDetail.tsx` — side-by-side unified block
- `src/modules/Education/index.tsx` — emerald accents
- `src/modules/About/index.tsx` — emerald accents
- `src/modules/Contact/index.tsx` — emerald accents
- `src/globals.css` — palette cleanup
- `src/locales/en.json`, `src/locales/br.json` — menu label keys

## i18n

- Add `home.menuOpen`/`home.menuClose` already exist from v1 (verify)
- No other new user-facing strings; name comes from `hero.title.value`
