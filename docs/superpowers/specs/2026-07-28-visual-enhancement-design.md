# Visual Enhancement Design

**Date**: 2026-07-28
**Status**: Draft
**Summary**: Motion-driven visual overhaul of the portfolio site — adding parallax effects, modern layered backgrounds, font upgrade, icon system, and fullscreen image lightbox — while preserving the existing glassmorphism aesthetic.

---

## 1. Goals

- Add scroll-based and mouse-tracking parallax effects
- Layer modern animated backgrounds (blob morphing, dot grid, noise grain)
- Replace Inter-only typography with Space Grotesk (headings) + JetBrains Mono (mono) + Inter (body)
- Migrate from unicode entities to Lucide React icon library
- Implement an advanced fullscreen image lightbox with pinch-to-zoom and keyboard/gallery navigation
- Preserve all existing glassmorphism, color system, translation-driven content, dark mode, and component structure

---

## 2. Dependencies

| Package                      | Version | Purpose                                                                    |
| ---------------------------- | ------- | -------------------------------------------------------------------------- |
| `framer-motion`              | ^12.x   | Scroll/mouse parallax, spring animations, `AnimatePresence`, `whileInView` |
| `@fontsource/space-grotesk`  | ^5.x    | Heading font (weights 400-700, self-hosted)                                |
| `@fontsource/jetbrains-mono` | ^5.x    | Mono font (weights 400-600, self-hosted)                                   |
| `lucide-react`               | ^0.x    | Icon library (tree-shakeable, 900+ icons)                                  |

**Removed**:

- Google Fonts `<link>` tag in `index.html` (replaced by `@fontsource` self-hosting via Vite)

---

## 3. Typography System

### Font Assignments

| Role     | Font           | Weights | Tailwind Class        |
| -------- | -------------- | ------- | --------------------- |
| Headings | Space Grotesk  | 400-700 | `font-heading`        |
| Body     | Inter          | 400-600 | `font-sans` (default) |
| Mono     | JetBrains Mono | 400-600 | `font-mono`           |

### Tailwind Config

Extend `@theme` in `src/globals.css`:

```css
@theme {
  --font-heading: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

### Import Strategy

Import in `src/main.tsx` or `src/globals.css`:

```ts
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/600.css";
```

### Type Scale Changes

| Element             | Before                           | After                                                        |
| ------------------- | -------------------------------- | ------------------------------------------------------------ |
| Hero name           | `text-5xl sm:text-7xl font-bold` | `text-6xl sm:text-8xl font-bold tracking-tight font-heading` |
| Section titles      | `text-3xl sm:text-4xl font-bold` | `text-4xl sm:text-5xl font-bold font-heading`                |
| Project card titles | current size                     | `font-heading font-semibold`                                 |
| Dates/metadata      | current size                     | `font-mono`                                                  |
| Body text           | current sizes                    | unchanged (Inter)                                            |

---

## 4. Icon System — Lucide React Migration

### Replacements

| Current    | New (Lucide)                       | Location                  |
| ---------- | ---------------------------------- | ------------------------- |
| `🎓` emoji | `<GraduationCap size={28} />`      | Education section         |
| `☰` / `✕` | `<Menu />` / `<X />`               | MenuBar hamburger         |
| `→` / `←`  | `<ArrowRight />` / `<ArrowLeft />` | Project cards, back links |
| `↗`        | `<ExternalLink />`                 | External link buttons     |

### New Icon Placements

| Icon                                                | Location                               |
| --------------------------------------------------- | -------------------------------------- |
| `Code2`, `Server`, `Palette`, `Smartphone`, `Globe` | Section header decorative prefixes     |
| `Calendar`, `Briefcase`, `MapPin`                   | About section timeline                 |
| `Mail`, `Phone`, `MessageCircle`                    | Contact buttons                        |
| `ChevronLeft`, `ChevronRight`, `X`, `Download`      | Lightbox controls                      |
| `Github`, `Linkedin`                                | Contact section (replaces text labels) |

### Conventions

- Inline icons: `size={16}` or `size={20}`
- Section headers: `size={24}`
- Hero-level: `size={32}`
- Lightbox: `size={28}`
- Color: `strokeWidth={2}`, inherit parent text color via `text-current`
- Skill PNG badges (brand icons) remain unchanged

---

## 5. Parallax & Motion Architecture

### Technology

All motion via **Framer Motion**. No additional animation libraries.

### Animation Tokens

```ts
const SPRING = { stiffness: 100, damping: 15 };
const REVEAL_DURATION = 0.6;
const STAGGER_DELAY = 0.1;
const PARALLAX_MULTIPLIER = 0.3;
```

### 5.1 Scroll-Based Parallax

| Element          | Effect                                 | Implementation                                                                                                                                              |
| ---------------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero section     | Name slides up + fades out             | `useScroll` on section ref → `useTransform(scrollYProgress, [0, 0.4], [0, -100])` (y), `[1, 0]` (opacity)                                                   |
| Background blobs | Drift at 0.2-0.3x scroll               | `useScroll` → `useTransform(scrollYProgress, [0, 1], ["0%", "30%"])` on blob `y`                                                                            |
| Section reveals  | Fade-in + slide-up on scroll into view | `<motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6 }}>` |
| Project cards    | Staggered reveals                      | Parent `<motion.div>` with `variants` using `staggerChildren: 0.15`, children via `variants`                                                                |
| Expertise cards  | Same staggered pattern                 | Same approach                                                                                                                                               |
| About cards      | Sequential reveal                      | Same `whileInView` with increasing delay per card                                                                                                           |
| Contact          | Scale-up reveal                        | `initial={{ scale: 0.95 }}` → `whileInView={{ scale: 1 }}`                                                                                                  |

### 5.2 Mouse-Tracking Parallax

| Element            | Effect                         | Range                  | Implementation                                         |
| ------------------ | ------------------------------ | ---------------------- | ------------------------------------------------------ |
| Hero text          | Follows cursor with spring lag | ±15px x/y              | `useMotionValue` + `useSpring` on mousemove            |
| GlassCards (hover) | 3D tilt toward cursor          | ±3deg rotation         | `useMotionValue` + `useSpring` → `rotateX/Y` transform |
| Skill badges       | Float on hover                 | ±2deg rotation         | Same approach, lighter spring                          |
| Project thumbnails | Tilt + lift                    | ±4deg rotation, ±5px y | Same approach                                          |
| Background blobs   | Shift opposite cursor          | ±2% position           | `useMotionValue` mapped to `translateX/Y`              |

### 5.3 Performance Guard

```tsx
const prefersReducedMotion = useReducedMotion();
const canHover = !prefersReducedMotion && window.matchMedia("(pointer: fine)").matches;
```

- Mouse-tracking parallax disabled when `prefersReducedMotion` is true or on touch devices
- Scroll-based effects respect `prefersReducedMotion` (instant transitions instead of spring)
- All `motion` components use `transform-gpu` for hardware acceleration

---

## 6. Modern Background — Triple Layer

A new `BackgroundDecoration` component placed in `Layout.tsx`, replacing the current single gradient blob.

### Layer 1: Animated Gradient Blobs

- 4 large overlapping `motion.div` circles with `blur-3xl`
- Colors: gray (`primary-400/10`), green (`success-400/10`), red (`danger-400/10`), yellow (`warning-400/10`)
- Each blob animates on its own CSS `@keyframes` orbit: 10-15s infinite `translate` loops
- Scroll-linked: y position drifts at 0.2x scroll speed
- Mouse-linked: position shifts 2% away from cursor direction
- Hidden on `prefers-reduced-motion`

### Layer 2: Dot Grid Pattern

- Fixed overlay, `pointer-events: none`
- CSS `radial-gradient` repeating pattern: 1px dots at 40px intervals
- Color: `currentColor` at 4% opacity (adapts to light/dark mode automatically)

### Layer 3: Noise Grain Overlay

- SVG `<filter>` with `<feTurbulence>`:
  ```html
  <filter id="noise">
    <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
  ```
- Applied as CSS `background-image` on a fixed overlay div
- Opacity: 3-4%
- `pointer-events: none`

### z-Index Stack

```
z-50: Lightbox
z-40: FullScreenMenu
z-30: MenuBar (currently z-20 → bump to z-30)
z-20: Sticker (currently z-10)
z-10: Page content
z-0:  Section containers
z--10: Background layers (all fixed, pointer-events: none)
  ├── Noise grain (topmost of background)
  ├── Dot grid (middle)
  └── Animated blobs (bottom)
```

---

## 7. Fullscreen Image Lightbox

### Component

**Path**: `src/components/Lightbox/index.tsx`

### API

```tsx
interface LightboxImage {
  src: string;
  alt?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}
```

### Behavior

| Feature           | Implementation                                                                                             |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| Mount             | `ReactDOM.createPortal` to `document.body`, z-50                                                           |
| Backdrop          | `bg-black/90 backdrop-blur-md`, fades in via `AnimatePresence`                                             |
| Image enter       | Fade + directional slide (spring), direction depends on navigation direction                               |
| Image exit        | Fade + slide opposite direction                                                                            |
| Counter           | Bottom center: `"2 / 5"` in JetBrains Mono, `text-sm text-white/60`                                        |
| Navigation arrows | Translucent `<ChevronLeft>` / `<ChevronRight>` buttons at edges, appear on hover, always visible on mobile |
| Close button      | Top-right `<X>` icon, `text-white/80 hover:text-white`                                                     |
| Keyboard          | `Escape` → close, `ArrowLeft` → prev, `ArrowRight` → next                                                  |
| Mouse             | Click backdrop → close, click arrows → navigate                                                            |
| Touch             | Swipe left/right → navigate (±50px threshold), pinch-to-zoom                                               |

### Pinch-to-Zoom

- Track `onTouchStart` / `onTouchMove` / `onTouchEnd`
- Two-finger pinch: compute distance delta, clamp zoom between 1x-3x
- Double-tap: toggle between 1x and 2x zoom
- Single finger drag when zoomed: pan the image
- Reset zoom on image change

### Image Loading

- Current image: `loading="eager"`
- Preload adjacent images (±1) via invisible `<img>` tags
- Dimmensions: `max-w-[90vw] max-h-[85vh] object-contain`

### Integration Points

| Location       | Trigger                 | Behavior                                                                                                                                            |
| -------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| ProjectCard    | Click thumbnail image   | Opens lightbox with all images from that project, starting at index 0. `event.stopPropagation()` prevents the surrounding `<Link>` from navigating. |
| Project detail | Click any image in grid | Opens lightbox with all project images, starting at clicked index                                                                                   |
| Lightbox state | Owned by parent page    | Each card/page has `<Lightbox>` with its own `open`/`onClose` state                                                                                 |

### State Per Project

Data already exists in translation files under `projects.<key>.images.list` — an array of `{ src, alt? }` objects. The lightbox consumes this directly.

---

## 8. File Change Inventory

### New Files

| File                                            | Purpose                                                     |
| ----------------------------------------------- | ----------------------------------------------------------- |
| `src/components/Lightbox/index.tsx`             | Fullscreen image lightbox with pinch-to-zoom and navigation |
| `src/components/BackgroundDecoration/index.tsx` | Triple-layer animated background                            |

### Modified Files

| File                                     | Changes                                                                                                               |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `index.html`                             | Remove Google Fonts `<link>` tag                                                                                      |
| `src/main.tsx`                           | Import `@fontsource/space-grotesk` and `@fontsource/jetbrains-mono`                                                   |
| `src/globals.css`                        | Add `--font-heading` and `--font-mono` to `@theme`, add noise SVG filter CSS, dot grid pattern CSS                    |
| `src/pages/Layout.tsx`                   | Replace gradient blob with `<BackgroundDecoration />`, adjust z-index of outer wrapper                                |
| `src/modules/Hero/index.tsx`             | Add `font-heading`, bump text sizes, add motion (scroll parallax + mouse tracking), remove unicode emoji              |
| `src/modules/Education/index.tsx`        | Replace `🎓` emoji with `<GraduationCap />`, wrap in motion for reveal                                                |
| `src/modules/Projects/ProjectCard.tsx`   | Add `font-heading` to title, add `font-mono` to date, add mouse-tracking tilt effect, thumbnail click → open lightbox |
| `src/modules/Projects/index.tsx`         | Wrap cards in motion grid with stagger, pass project images to lightbox                                               |
| `src/modules/Expertise/index.tsx`        | Wrap cards in motion grid with stagger                                                                                |
| `src/modules/Expertise/Skill.tsx`        | Add mouse-tracking float effect (subtle)                                                                              |
| `src/modules/About/index.tsx`            | Add reveal animations, use Lucide icons for timeline markers                                                          |
| `src/modules/Contact/index.tsx`          | Replace text labels with Lucide icons in buttons, add reveal animation                                                |
| `src/modules/MenuBar/index.tsx`          | Replace `☰`/`✕` with `<Menu />`/`<X />`, bump z-index                                                                |
| `src/modules/MenuBar/FullScreenMenu.tsx` | Replace unicode arrows with Lucide icons                                                                              |
| `src/modules/Sticker/index.tsx`          | Add `Mail` icon, bump z-index                                                                                         |
| `src/pages/project/index.tsx`            | Add image click → lightbox, `font-heading` on title, `font-mono` on date                                              |
| `src/components/SectionTitle/index.tsx`  | Accept optional `icon` prop (Lucide `Icon` type), use `font-heading`                                                  |
| `src/components/GlassCard/index.tsx`     | Add mouse-tracking tilt effect variant (optional, controlled by prop)                                                 |

### Not Modified

| File                         | Reason                    |
| ---------------------------- | ------------------------- |
| `src/locales/en.json`        | No content changes needed |
| `src/locales/br.json`        | No content changes needed |
| `src/assets/expertise.json`  | No data changes needed    |
| `src/i18n.ts`                | No config changes         |
| `src/router.tsx`             | No route changes          |
| All skill and project images | No image changes          |

---

## 9. Constraints & Non-Goals

### Constraints

- Must typecheck cleanly (`tsc -b`) — `noUnusedLocals` and `noUnusedParameters` enforced
- Must lint cleanly (`npm run lint`)
- Must build (`npm run build`)
- Glassmorphism aesthetic preserved — GlassCard, SectionTitle, color system untouched
- Translation-driven content preserved — no hardcoded UI strings
- Dark mode via `prefers-color-scheme` preserved
- No test suite exists — visual verification only

### Non-Goals

- No class-based dark mode toggle
- No Next.js migration
- No new animation library beyond Framer Motion
- No new routes
- No changes to translation files or data files
- No changes to the code-as-UI bracket decoration concept (those components don't exist yet, and this design doesn't add them)

---

## 10. Execution Order

1. Install dependencies (`framer-motion`, `@fontsource/space-grotesk`, `@fontsource/jetbrains-mono`, `lucide-react`)
2. Font setup (remove Google Fonts, add fontsource imports, extend Tailwind theme)
3. `BackgroundDecoration` component (triple-layer background)
4. `Lightbox` component (fullscreen image viewer)
5. `Layout.tsx` — swap background, adjust z-indices
6. `SectionTitle` — icon prop + font-heading
7. `GlassCard` — optional tilt effect
8. `Hero` — fonts, sizes, scroll parallax, mouse tracking
9. `Education` — icon replacement, reveal animation
10. `Projects` — stagger grid, card tilt, lightbox integration
11. `Expertise` — stagger grid, skill badge float
12. `About` — reveal animations, Lucide icons
13. `Contact` — icon replacement, reveal
14. `MenuBar` + `FullScreenMenu` — icon replacement, z-index
15. `Sticker` — icon, z-index
16. `Project` detail page — fonts, lightbox integration
17. Verify: `npm run lint` + `npm run typecheck` + `npm run build`
