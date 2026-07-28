# Visual Enhancement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Motion-driven visual overhaul of the portfolio — parallax effects, layered backgrounds, fonts, icons, fullscreen lightbox — preserving the glassmorphism foundation.

**Architecture:** Framer Motion drives all scroll/mouse parallax and reveals. Fontsource packages self-host Space Grotesk (headings) + JetBrains Mono (mono) alongside existing Inter (body). Lucide React replaces all unicode icons. A new Lightbox component uses React portal + AnimatePresence. A new BackgroundDecoration component layers animated blobs, a dot grid, and noise grain.

**Tech Stack:** React 19, TypeScript strict, Tailwind CSS v4, Framer Motion, Lucide React, Fontsource, Vite 8

## Global Constraints

- TypeScript strict mode — `noUnusedLocals` and `noUnusedParameters` enabled
- All paths use `@/` alias (resolves to `src/`); never use relative imports for internal modules
- Translation-driven content — no hardcoded user-facing strings in components
- Dark mode via `prefers-color-scheme` media query only; no class-based toggle
- Glassmorphism visual preserved: `backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl shadow-xl`
- No test suite exists — verification is `npm run lint && npm run build`
- JSX is no longer a global namespace — use `React.JSX.Element` for explicit return types
- `motion.div` from framer-motion replaces `div` where animation is needed
- Mouse-tracking effects must be disabled on touch devices and when `prefers-reduced-motion` is set

---

### Task 1: Dependencies + Font Setup

**Files:**
- Modify: `index.html`
- Modify: `src/main.tsx`
- Modify: `src/globals.css`

**Interfaces:**
- Consumes: existing project structure
- Produces: font theme tokens `--font-heading` and `--font-mono` available in tailwind via `font-heading` / `font-mono`

- [ ] **Step 1: Install dependencies**

Run: `npm install framer-motion @fontsource/space-grotesk @fontsource/jetbrains-mono lucide-react`

Expected: packages added to `dependencies` in `package.json`.

- [ ] **Step 2: Remove Google Fonts from index.html**

Edit `index.html`: remove lines 8-10 (the two `<link rel="preconnect">` tags and the Inter stylesheet link).

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Aldair Garros — Fullstack Developer & Software Engineering Specialist. Portfolio showcasing web and mobile development projects." />
    <title>Aldair Garros — Developer & Software Engineering Specialist</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 3: Add fontsource imports to main.tsx**

Edit `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "./i18n.ts";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/600.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 4: Extend Tailwind theme with new fonts**

Edit `src/globals.css` — add `--font-heading` and `--font-mono` to `@theme`:

```css
@import "tailwindcss";

@theme {
  --color-primary-50: var(--color-zinc-50);
  --color-primary-100: var(--color-zinc-100);
  --color-primary-200: var(--color-zinc-200);
  --color-primary-300: var(--color-zinc-300);
  --color-primary-400: var(--color-zinc-400);
  --color-primary-500: var(--color-zinc-500);
  --color-primary-600: var(--color-zinc-600);
  --color-primary-700: var(--color-zinc-700);
  --color-primary-800: var(--color-zinc-800);
  --color-primary-900: var(--color-zinc-900);
  --color-primary-950: var(--color-zinc-950);

  --color-secondary-50: var(--color-rose-50);
  --color-secondary-100: var(--color-rose-100);
  --color-secondary-200: var(--color-rose-200);
  --color-secondary-300: var(--color-rose-300);
  --color-secondary-400: var(--color-rose-400);
  --color-secondary-500: var(--color-rose-500);
  --color-secondary-600: var(--color-rose-600);
  --color-secondary-700: var(--color-rose-700);
  --color-secondary-800: var(--color-rose-800);
  --color-secondary-900: var(--color-rose-900);
  --color-secondary-950: var(--color-rose-950);

  --font-heading: "Space Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}

:root {
  font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--color-primary-50);
  color: var(--color-primary-950);
}

@media (prefers-color-scheme: dark) {
  :root {
    background-color: var(--color-primary-900);
    color: var(--color-primary-50);
  }
}
```

- [ ] **Step 5: Verify setup**

Run: `npm run build`

Expected: Build succeeds with no errors. New font theme tokens are available.

---

### Task 2: BackgroundDecoration Component

**Files:**
- Create: `src/components/BackgroundDecoration/index.tsx`
- Modify: `src/pages/Layout.tsx`

**Interfaces:**
- Exports: `BackgroundDecoration` (no props, renders fixed triple-layer background)
- Consumes: framer-motion `useScroll`, `useTransform`, `useMotionValue`, `useSpring`

- [ ] **Step 1: Create BackgroundDecoration component**

Create `src/components/BackgroundDecoration/index.tsx`:

```tsx
import { useScroll, useTransform, useMotionValue, useSpring, motion, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 2);
      y.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    const canHover = window.matchMedia("(pointer: fine)").matches;
    if (canHover) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return { x, y };
}

function useParallaxOffset(multiplier: number) {
  const { scrollYProgress } = useScroll();
  return useTransform(scrollYProgress, [0, 1], [0, multiplier * 100]);
}

export function BackgroundDecoration() {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMousePosition().x;
  const mouseY = useMousePosition().y;

  const blob1X = useSpring(useTransform(mouseX, [-1, 1], [-2, 2]), { stiffness: 80, damping: 20 });
  const blob1Y = useSpring(useTransform(mouseY, [-1, 1], [-2, 2]), { stiffness: 80, damping: 20 });
  const blob2X = useSpring(useTransform(mouseX, [-1, 1], [1.5, -1.5]), { stiffness: 80, damping: 20 });
  const blob2Y = useSpring(useTransform(mouseY, [-1, 1], [1.5, -1.5]), { stiffness: 80, damping: 20 });

  const scrollOffset = useParallaxOffset(-0.2);

  const blobs = [
    { color: "bg-primary-400/10", size: "w-[600px] h-[600px]", top: "-10%", left: "-5%", x: blob1X, y: blob1Y, animDuration: 12 },
    { color: "bg-success-400/10", size: "w-[500px] h-[500px]", top: "40%", right: "-10%", x: blob2X, y: blob2Y, animDuration: 15 },
    { color: "bg-danger-400/10", size: "w-[400px] h-[400px]", top: "60%", left: "30%", x: blob1X, y: blob2Y, animDuration: 10 },
    { color: "bg-warning-400/10", size: "w-[350px] h-[350px]", top: "15%", right: "25%", x: blob2X, y: blob1Y, animDuration: 14 },
  ];

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      {/* Layer 1: Animated blobs */}
      {!prefersReducedMotion && blobs.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute ${blob.size} ${blob.color} blur-3xl rounded-full`}
          style={{
            top: blob.top,
            left: "left" in blob ? blob.left : undefined,
            right: "right" in blob ? blob.right : undefined,
            x: blob.x,
            y: blob.y,
          }}
          animate={{
            x: [0, 30, -20, 10, 0],
            y: [0, -20, 30, -10, 0],
          }}
          transition={{
            duration: blob.animDuration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Layer 2: Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.04,
        }}
      />

      {/* Layer 3: Noise grain */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.035 }}>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Update Layout.tsx**

Edit `src/pages/Layout.tsx` — replace the current gradient blob with `<BackgroundDecoration />`:

```tsx
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MenuBar } from "@/modules/MenuBar";
import { BackgroundDecoration } from "@/components/BackgroundDecoration";

const SECTIONS = ["home", "education", "projects", "expertise", "about", "contact"];

export function RootLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center">
      <MenuBar links={SECTIONS.map((id) => ({ label: t(`${id}.title`), hash: id }))} />
      <BackgroundDecoration />
      <Outlet />
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build`

Expected: Build succeeds. No type errors. Background component compiles cleanly.

---

### Task 3: Lightbox Component

**Files:**
- Create: `src/components/Lightbox/index.tsx`

**Interfaces:**
- Exports: `LightboxProps` type, `Lightbox` component
- Consumes: `images: LightboxImage[]`, `initialIndex: number`, `open: boolean`, `onClose: () => void`
- Produces: fullscreen portal with image navigation and pinch-to-zoom

- [ ] **Step 1: Create Lightbox component**

Create `src/components/Lightbox/index.tsx`:

```tsx
import { useState, useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt?: string;
}

interface Props {
  images: LightboxImage[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex = 0, open, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState(0);
  const touchRef = useRef<{ startX: number; startDist: number; startZoom: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setIndex(initialIndex);
  }, [initialIndex, open]);

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [open, index]);

  const prev = useCallback(() => {
    if (images.length <= 1) return;
    setDirection(-1);
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    if (images.length <= 1) return;
    setDirection(1);
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose, prev, next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchRef.current = { startX: 0, startDist: dist, startZoom: zoom };
    } else if (e.touches.length === 1) {
      touchRef.current = { startX: e.touches[0].clientX, startDist: 0, startZoom: zoom };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    if (e.touches.length === 2 && touchRef.current.startDist > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newZoom = Math.max(1, Math.min(3, touchRef.current.startZoom * (dist / touchRef.current.startDist)));
      setZoom(newZoom);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    if (e.changedTouches.length === 1 && touchRef.current.startDist === 0) {
      const diff = e.changedTouches[0].clientX - touchRef.current.startX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) prev();
        else next();
      }
    }
    touchRef.current = null;
  };

  const handleDoubleClick = () => {
    if (zoom > 1) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      setZoom(2);
    }
  };

  if (!open) return null;

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
        aria-label="Close lightbox"
      >
        <X size={28} />
      </button>

      {/* Counter */}
      <span className="absolute top-4 left-4 z-10 text-sm text-white/60 font-mono">
        {index + 1} / {images.length}
      </span>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-4 z-10 p-2 text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
          aria-label="Previous image"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Image */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={index}
          custom={direction}
          variants={{
            enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="flex items-center justify-center w-full h-full p-16"
        >
          <img
            ref={imageRef}
            src={images[index].src}
            alt={images[index].alt ?? ""}
            className="max-w-[90vw] max-h-[85vh] object-contain select-none"
            style={{ transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`, cursor: zoom > 1 ? "grab" : "zoom-in" }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onDoubleClick={handleDoubleClick}
            draggable={false}
          />
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={next}
          className="absolute right-4 z-10 p-2 text-white/60 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-full"
          aria-label="Next image"
        >
          <ChevronRight size={28} />
        </button>
      )}
    </motion.div>,
    document.body
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`

Expected: Build succeeds. Lightbox component compiles.

---

### Task 4: Shared Components Upgrade — SectionTitle + GlassCard

**Files:**
- Modify: `src/components/SectionTitle/index.tsx`
- Modify: `src/components/GlassCard/index.tsx`

**Interfaces:**
- Produces: `SectionTitle` gains optional `icon` prop (Lucide icon component) and `font-heading`
- Produces: `GlassCard` gains optional `tilt` prop for 3D hover effect

- [ ] **Step 1: Update SectionTitle**

Edit `src/components/SectionTitle/index.tsx`:

```tsx
import { type LucideIcon } from "lucide-react";

interface Props {
  title: string;
  id?: string;
  icon?: LucideIcon;
}

export function SectionTitle({ title, id, icon: Icon }: Props) {
  return (
    <div className="mb-12">
      <h2
        id={id}
        className="text-4xl sm:text-5xl font-bold font-heading text-primary-900 dark:text-primary-50 flex items-center gap-3">
        {Icon && <Icon size={28} className="text-secondary-500 shrink-0" />}
        {title}
      </h2>
      <div className="mt-3 h-1 w-16 bg-gradient-to-r from-secondary-500 to-secondary-400 rounded-full" />
    </div>
  );
}
```

- [ ] **Step 2: Update GlassCard with tilt effect**

Edit `src/components/GlassCard/index.tsx`:

```tsx
import { HTMLAttributes, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

interface Props extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  tilt?: boolean;
}

export function GlassCard({ children, hover = false, tilt = false, className = "", ...rest }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    if (!tilt) return;
    x.set(0);
    y.set(0);
  };

  const baseClasses = `backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl shadow-xl p-6 ${
    hover ? "hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300" : ""
  } ${className}`;

  if (tilt) {
    return (
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={baseClasses}
        {...rest}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...rest}>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build`

Expected: Build succeeds.

---

### Task 5: Hero Section Enhancement

**Files:**
- Modify: `src/modules/Hero/index.tsx`

- [ ] **Step 1: Rewrite Hero with motion, fonts, and mouse tracking**

Edit `src/modules/Hero/index.tsx`:

```tsx
import { useTranslation } from "react-i18next";
import { useScroll, useTransform, useMotionValue, useSpring, motion, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";

export function Hero() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();

  // Scroll parallax
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 80, damping: 15 });
  const springY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-12, 12]), { stiffness: 80, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center max-h-[1024px] h-screen px-4 text-center"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        style={{ y: prefersReducedMotion ? 0 : heroY, opacity: prefersReducedMotion ? 1 : heroOpacity }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-500/10 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-sm sm:text-base font-medium text-secondary-600 dark:text-secondary-400 mb-4 tracking-widest uppercase">
            {t("hero.title.label")}
          </p>
          <motion.h1
            className="text-6xl sm:text-8xl font-bold font-heading tracking-tight text-primary-900 dark:text-primary-50 mb-6"
            style={{ x: prefersReducedMotion ? 0 : springX, y: prefersReducedMotion ? 0 : springY }}
          >
            {t("hero.title.value")}
          </motion.h1>
          <p className="text-lg sm:text-xl text-primary-600 dark:text-primary-400 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle.value")}
          </p>
          <div className="mt-8 flex justify-center">
            <GlassCard className="inline-flex items-center gap-2 px-5 py-2 border-secondary-500/30">
              <span className="text-secondary-600 dark:text-secondary-400 text-sm font-semibold">
                {t("education.course.institution")}
              </span>
            </GlassCard>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`

Expected: Build succeeds.

---

### Task 6: Education Section — Icon + Reveal

**Files:**
- Modify: `src/modules/Education/index.tsx`

- [ ] **Step 1: Add Lucide icon and motion reveal**

Edit `src/modules/Education/index.tsx`:

```tsx
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";

export function Education() {
  const { t } = useTranslation("translation", { keyPrefix: "education" });

  return (
    <section id="education" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} icon={GraduationCap} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard hover className="max-w-2xl">
          <div className="flex items-start gap-4">
            <GraduationCap size={28} className="text-secondary-500 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold font-heading text-primary-900 dark:text-primary-50">
                {t("course.title")}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                {t("course.institution")} &mdash; {t("course.period")}
              </p>
              <p className="mt-4 text-primary-700 dark:text-primary-300 leading-relaxed">
                {t("course.description")}
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`

Expected: Build succeeds.

---

### Task 7: Projects Section — Grid, Card Tilt, Lightbox

**Files:**
- Modify: `src/modules/Projects/index.tsx`
- Modify: `src/modules/Projects/ProjectCard.tsx`

- [ ] **Step 1: Rewrite ProjectCard with fonts, tilt, and lightbox trigger**

Edit `src/modules/Projects/ProjectCard.tsx`:

```tsx
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";

interface ProjectProps extends React.HTMLAttributes<HTMLDivElement> {
  project: string;
}

export function ProjectCard({ project, ...rest }: ProjectProps) {
  const { t } = useTranslation("translation", { keyPrefix: `projects.list.${project}` });
  const { t: tp } = useTranslation("translation", { keyPrefix: "projects" });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images: LightboxImage[] = (() => {
    const raw = t("images.list", { returnObjects: true }) as Record<string, unknown> | undefined;
    if (!raw) return [];
    return Object.keys(raw)
      .filter((k) => k.startsWith("image"))
      .map((key) => ({
        src: t(`images.list.${key}.src`),
        alt: t(`images.list.${key}.alt`),
      }));
  })();

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLightboxOpen(true);
  }, []);

  return (
    <>
      <GlassCard hover tilt className="overflow-hidden p-0 group" {...rest}>
        <Link to={`/projects/${project}`} className="flex flex-col h-full">
          <div className="relative overflow-hidden bg-primary-100 dark:bg-primary-800">
            <img
              src={t("image.src")}
              alt={t("image.alt")}
              width={600}
              height={400}
              className="w-full h-64 object-contain p-6 group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
              onClick={handleImageClick}
            />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold font-heading text-primary-900 dark:text-primary-50">
                {t("name.value")}
              </h3>
              <span className="text-sm font-mono text-primary-500 dark:text-primary-400">
                {t("date.value")}
              </span>
            </div>
            <p className="text-sm text-primary-600 dark:text-primary-400 line-clamp-3">
              {t("overview.value")}
            </p>
            <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-secondary-600 dark:text-secondary-400 group-hover:gap-2 transition-all">
              {tp("open")}
              <ArrowRight size={14} aria-hidden="true" />
            </span>
          </div>
        </Link>
      </GlassCard>

      {images.length > 0 && (
        <Lightbox
          images={images}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
```

- [ ] **Step 2: Add stagger animation to Projects grid**

Edit `src/modules/Projects/index.tsx`:

```tsx
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/SectionTitle";
import { ProjectCard } from "./ProjectCard";
import { useTranslation } from "react-i18next";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function Projects() {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });
  const projects = ["penhor", "musicaShow", "bolsobom", "atalaiaPro"];

  return (
    <section id="projects" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {projects.map((project) => (
          <motion.div key={project} variants={itemVariants}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build`

Expected: Build succeeds.

---

### Task 8: Expertise Section — Stagger Grid + Skill Float

**Files:**
- Modify: `src/modules/Expertise/index.tsx`
- Modify: `src/modules/Expertise/Skill.tsx`

- [ ] **Step 1: Add stagger animation to Expertise grid**

Edit `src/modules/Expertise/index.tsx`:

```tsx
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";
import { Skill } from "@/modules/Expertise/Skill";
import expertise from "@/assets/expertise.json";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function Expertise() {
  const { t } = useTranslation("translation", { keyPrefix: "expertise" });

  return (
    <section id="expertise" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {expertise.map((capability, index) => {
          const isLastOdd =
            index === expertise.length - 1 && expertise.length % 2 !== 0;

          return (
            <motion.div key={capability.id} variants={itemVariants}>
              <GlassCard
                hover
                className={`p-8 ${isLastOdd ? "md:col-span-2" : ""}`}>
                <h3 className="text-xl font-semibold font-heading text-primary-900 dark:text-primary-50 mb-4">
                  {t(`list.${capability.id}.title`)}
                </h3>
                <div className="space-y-3 text-sm">
                  <p>
                    <span className="font-medium text-primary-900 dark:text-primary-50">
                      {t("contextLabel")}:
                    </span>{" "}
                    <span className="text-primary-600 dark:text-primary-400">
                      {t(`list.${capability.id}.context`)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-primary-900 dark:text-primary-50">
                      {t("applicabilityLabel")}:
                    </span>{" "}
                    <span className="text-primary-600 dark:text-primary-400">
                      {t(`list.${capability.id}.applicability`)}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-primary-900 dark:text-primary-50">
                      {t("impactLabel")}:
                    </span>{" "}
                    <span className="text-primary-600 dark:text-primary-400">
                      {t(`list.${capability.id}.impact`)}
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 mt-6">
                  {capability.tech.map((tech) => (
                    <Skill key={tech} expertise={capability.id} skill={tech} />
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Add mouse float effect to Skill badges**

Edit `src/modules/Expertise/Skill.tsx`:

```tsx
import { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

interface Props extends HTMLAttributes<HTMLDivElement> {
  expertise: string;
  skill: string;
}

export function Skill({ expertise, skill, ...rest }: Props) {
  const { t } = useTranslation("translation", { keyPrefix: "expertise" });
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [2, -2]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-2, 2]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 600 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex flex-col items-center gap-2 p-3 rounded-xl backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 hover:scale-110 transition-transform cursor-default w-20"
      {...rest}>
      <img
        src={`skill_images/${t(`list.${expertise}.list.${skill}.imageSrc`)}`}
        alt={t(`list.${expertise}.list.${skill}.label`)}
        width={40}
        height={40}
        className="w-10 h-10 object-contain"
      />
      <span className="text-xs text-center text-primary-700 dark:text-primary-300 leading-tight">
        {t(`list.${expertise}.list.${skill}.label`)}
      </span>
    </motion.div>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build`

Expected: Build succeeds.

---

### Task 9: About Section — Lucide Icons + Reveal Animations

**Files:**
- Modify: `src/modules/About/index.tsx`

- [ ] **Step 1: Rewrite About with icons and reveal**

Edit `src/modules/About/index.tsx`:

```tsx
import { motion } from "framer-motion";
import { Briefcase, Calendar } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";
import { useTranslation } from "react-i18next";

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function About() {
  const { t } = useTranslation("translation", { keyPrefix: "about" });
  const LIST = ["experience1", "experience2"];

  return (
    <section id="about" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} icon={Briefcase} />
      <div className="flex flex-col gap-8">
        {LIST.map((item, index) => (
          <motion.div
            key={item}
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: index * 0.15 }}
          >
            <GlassCard hover className="p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h3 className="text-xl font-semibold font-heading text-primary-900 dark:text-primary-50 flex items-center gap-2">
                  <Briefcase size={20} className="text-secondary-500 shrink-0" />
                  {t(`list.${item}.title.value`)}
                </h3>
                <span className="text-sm font-mono text-primary-500 dark:text-primary-400 mt-1 sm:mt-0 flex items-center gap-1">
                  <Calendar size={14} />
                  {t(`list.${item}.start.value`)} &mdash; {t(`list.${item}.end.value`)}
                </span>
              </div>
              <p className="text-primary-700 dark:text-primary-300 leading-relaxed mb-4">
                {t(`list.${item}.description.value`)}
              </p>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-medium text-primary-900 dark:text-primary-50">
                    {t(`list.${item}.work.label`)}:
                  </span>{" "}
                  <span className="text-primary-600 dark:text-primary-400">
                    {t(`list.${item}.work.value`)}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-primary-900 dark:text-primary-50">
                    {t(`list.${item}.tools.label`)}:
                  </span>{" "}
                  <span className="text-primary-600 dark:text-primary-400">
                    {t(`list.${item}.tools.value`)}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-primary-900 dark:text-primary-50">
                    {t(`list.${item}.achievements.label`)}:
                  </span>{" "}
                  <span className="text-primary-600 dark:text-primary-400">
                    {t(`list.${item}.achievements.value`)}
                  </span>
                </p>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`

Expected: Build succeeds.

---

### Task 10: Contact Section — Lucide Icons + Reveal

**Files:**
- Modify: `src/modules/Contact/index.tsx`

- [ ] **Step 1: Rewrite Contact with Lucide icons and reveal**

Edit `src/modules/Contact/index.tsx`:

```tsx
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Linkedin, Github } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";
import { useTranslation } from "react-i18next";

const ICON_MAP: Record<string, typeof Mail> = {
  email: Mail,
  phone: Phone,
  whatsApp: MessageCircle,
  linkedIn: Linkedin,
  github: Github,
};

const EXTERNAL_KEYS = ["whatsApp", "linkedIn", "github"];

export function Contact() {
  const { t } = useTranslation("translation", { keyPrefix: "contact" });
  const keys = ["email", "phone", "whatsApp", "linkedIn", "github"] as const;

  return (
    <section id="contact" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="flex items-center">
          <p className="text-primary-700 dark:text-primary-300 leading-relaxed text-lg">
            {t("message")}
          </p>
        </GlassCard>
        <div className="flex flex-col gap-3">
          {keys.map((key) => {
            const href = t(`list.${key}.href`);
            const value = t(`list.${key}.value`);
            const isExternal = EXTERNAL_KEYS.includes(key);
            const Icon = ICON_MAP[key];

            const extraProps = isExternal
              ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
              : {};

            return (
              <a
                key={key}
                href={href}
                {...extraProps}
                className="inline-flex items-center gap-3 px-4 py-3 rounded-full border border-primary-200 dark:border-primary-700 text-sm text-primary-700 dark:text-primary-300 hover:bg-secondary-500 hover:text-white hover:border-secondary-500 transition-colors focus:ring-2 focus:ring-secondary-500 focus:outline-none"
              >
                <Icon size={18} className="shrink-0" />
                {value}
              </a>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`

Expected: Build succeeds.

---

### Task 11: MenuBar, FullScreenMenu, Sticker — Icons + z-index

**Files:**
- Modify: `src/modules/MenuBar/index.tsx`
- Modify: `src/modules/MenuBar/FullScreenMenu.tsx`
- Modify: `src/modules/Sticker/index.tsx`

- [ ] **Step 1: Update MenuBar with Lucide icons and z-index bump**

Edit `src/modules/MenuBar/index.tsx` — replace `☰`/`✕` with Lucide `Menu`/`X`, bump z-index to `z-30`:

```tsx
import { useState } from "react";
import { FullScreenMenu } from "./FullScreenMenu";
import { Link, ScrollRestoration } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";

interface LinkItem {
  label: string;
  hash: string;
}

interface Props {
  links: LinkItem[];
}

export function MenuBar({ links }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { i18n } = useTranslation();
  const { language, changeLanguage } = i18n;

  const updateHtmlLang = (lang: string) => {
    document.documentElement.lang = lang;
  };

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    updateHtmlLang(lang);
  };

  return (
    <>
      <ScrollRestoration />
      <nav
        className="fixed top-0 flex justify-end w-full backdrop-blur-md bg-white/70 dark:bg-primary-900/70 z-30"
        role="navigation"
        aria-label="Main navigation">
        <button
          className="sm:hidden flex items-center justify-center w-12 h-12 cursor-pointer select-none focus:ring-2 focus:ring-secondary-500 focus:outline-none"
          onClick={() => setIsMenuOpen((state) => !state)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}>
          {isMenuOpen ? <X size={20} className="text-primary-900 dark:text-primary-50" /> : <Menu size={20} className="text-primary-900 dark:text-primary-50" />}
        </button>
        <div className="hidden sm:flex w-full max-w-6xl h-12 mx-auto items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="text-lg font-bold text-primary-900 dark:text-primary-50 mr-6 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors focus:ring-2 focus:ring-secondary-500 focus:outline-none rounded">
              AG
            </Link>
            {links.map((link) => (
              <Link
                key={link.hash}
                className="px-3 py-1 text-sm font-medium text-primary-700 dark:text-primary-300 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors rounded focus:ring-2 focus:ring-secondary-500 focus:outline-none"
                to={{ pathname: "/", hash: link.hash }}>
                {link.label}
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            <div className="flex rounded-full border border-primary-300 dark:border-primary-600 overflow-hidden">
              <button
                className={`px-3 py-1 text-xs font-medium transition-colors focus:ring-2 focus:ring-secondary-500 focus:outline-none ${
                  language === "en"
                    ? "bg-secondary-500 text-white"
                    : "text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200"
                }`}
                onClick={() => handleLanguageChange("en")}
                aria-label="Switch to English"
                aria-pressed={language === "en"}>
                EN
              </button>
              <button
                className={`px-3 py-1 text-xs font-medium transition-colors focus:ring-2 focus:ring-secondary-500 focus:outline-none ${
                  language === "br"
                    ? "bg-secondary-500 text-white"
                    : "text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200"
                }`}
                onClick={() => handleLanguageChange("br")}
                aria-label="Mudar para português"
                aria-pressed={language === "br"}>
                BR
              </button>
            </div>
          </div>
        </div>
      </nav>
      <FullScreenMenu
        open={isMenuOpen}
        links={links}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
}
```

- [ ] **Step 2: Update FullScreenMenu with Lucide icons**

Edit `src/modules/MenuBar/FullScreenMenu.tsx`:

```tsx
import { HTMLAttributes } from "react";
import { Link } from "react-router-dom";

interface LinkItem {
  label: string;
  hash: string;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  links: LinkItem[];
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export function FullScreenMenu({ open, links, currentLanguage, onLanguageChange, ...rest }: Props) {
  return (
    <div
      className={`fixed inset-0 top-12 bg-white/95 dark:bg-primary-900/95 backdrop-blur-md z-40 overscroll-contain overflow-hidden transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      {...rest}>
      <div className="flex flex-col gap-6 w-full h-full p-8 pt-12">
        <div className="flex flex-col gap-2">
          {links.map((link, ind) => (
            <Link
              key={link.hash}
              className={`text-2xl font-medium font-heading text-primary-900 dark:text-primary-50 hover:text-secondary-600 dark:hover:text-secondary-400 transition-all duration-300 cursor-pointer focus:ring-2 focus:ring-secondary-500 focus:outline-none rounded ${
                open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: `${ind * 50}ms` }}
              to={{ pathname: "/", hash: link.hash }}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          {(["en", "br"] as const).map((lang, ind) => (
            <button
              key={lang}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer focus:ring-2 focus:ring-secondary-500 focus:outline-none ${
                open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              } ${
                currentLanguage === lang
                  ? "bg-secondary-500 text-white"
                  : "border border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300"
              }`}
              style={{ transitionDelay: `${(links.length + ind) * 50}ms` }}
              onClick={() => onLanguageChange(lang)}
              aria-label={lang === "en" ? "Switch to English" : "Mudar para português"}>
              {lang === "en" ? "English" : "Português"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update Sticker with Lucide icon and z-index bump**

Edit `src/modules/Sticker/index.tsx`:

```tsx
import { Mail } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useTranslation } from "react-i18next";

export function Sticker() {
  const { t } = useTranslation();

  return (
    <div className="fixed hidden lg:block bottom-8 left-8 z-20">
      <GlassCard className="px-4 py-2 text-sm">
        <a
          href={`mailto:${t("contact.list.email.value")}`}
          className="inline-flex items-center gap-2 text-primary-700 dark:text-primary-300 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors focus:ring-2 focus:ring-secondary-500 focus:outline-none rounded">
          <Mail size={16} />
          {t("contact.list.email.value")}
        </a>
      </GlassCard>
    </div>
  );
}
```

- [ ] **Step 4: Verify**

Run: `npm run build`

Expected: Build succeeds.

---

### Task 12: Project Detail Page — Fonts + Lightbox Integration

**Files:**
- Modify: `src/pages/project/index.tsx`

- [ ] **Step 1: Add fonts and lightbox to project detail page**

Edit `src/pages/project/index.tsx`:

```tsx
import { useState, useCallback } from "react";
import { ScrollRestoration, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Contact } from "@/modules/Contact";
import { GlassCard } from "@/components/GlassCard";
import { SectionTitle } from "@/components/SectionTitle";
import { ProjectList } from "@/modules/Projects/ProjectList";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";

export function Project() {
  const { project } = useParams();
  const PROJECTLIST = ["penhor", "musicaShow", "bolsobom", "atalaiaPro"];

  const { t: p } = useTranslation("translation", { keyPrefix: `projects.list.${project}` });
  const { t: tProjects } = useTranslation("translation", { keyPrefix: "projects" });

  const imageData = (() => {
    const raw = p("images.list", { returnObjects: true }) as Record<string, unknown> | undefined;
    if (!raw) return [];
    return Object.keys(raw)
      .filter((k) => k.startsWith("image"))
      .map((key) => ({
        src: p(`images.list.${key}.src`),
        alt: p(`images.list.${key}.alt`),
        width: p(`images.list.${key}.width`),
        height: p(`images.list.${key}.height`),
      }));
  })();

  const lightboxImages: LightboxImage[] = imageData.map(({ src, alt }) => ({ src, alt }));

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const linkHref = p("link.href");
  const linkValue = p("link.value");

  return (
    <main className="flex min-h-screen flex-col pt-16">
      <ScrollRestoration />
      <div className="py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-1 text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 transition-colors mb-12 focus:ring-2 focus:ring-secondary-500 focus:outline-none rounded">
          <ArrowLeft size={16} aria-hidden="true" />
          {tProjects("title")}
        </Link>

        <SectionTitle title={p("name.value")} />

        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-primary-500 dark:text-primary-400">
              {p("date.value")}
            </span>
          </div>

          <GlassCard>
            <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
              {p("description.value")}
            </p>
          </GlassCard>

          <GlassCard>
            <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
              {p("details.value")}
            </p>
          </GlassCard>

          {linkHref && (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-full border border-secondary-500/30 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-500 hover:text-white transition-colors font-medium text-sm focus:ring-2 focus:ring-secondary-500 focus:outline-none">
              {linkValue || "Visit project"}
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          )}

          {imageData.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-primary-500 dark:text-primary-400 mb-4">
                {p("images.label")}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageData.map((img, index) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    width={+img.width}
                    height={+img.height}
                    className="rounded-xl object-contain w-full h-auto cursor-zoom-in hover:ring-2 hover:ring-secondary-500/50 transition-all duration-200"
                    loading="lazy"
                    onClick={() => openLightbox(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-primary-100/50 dark:bg-primary-800/30">
        <ProjectList list={PROJECTLIST.filter((item) => item !== project)} />
      </div>

      <div className="w-full">
        <Contact />
      </div>

      {lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </main>
  );
}
```

- [ ] **Step 2: Also add stagger animation to ProjectList**

Edit `src/modules/Projects/ProjectList.tsx`:

```tsx
import { motion } from "framer-motion";
import { SectionTitle } from "@/components/SectionTitle";
import { ProjectCard } from "./ProjectCard";
import { useTranslation } from "react-i18next";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

interface Props {
  list: string[];
}

export function ProjectList({ list }: Props) {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });

  if (list.length === 0) return null;

  return (
    <section className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {list.map((project) => (
          <motion.div key={project} variants={itemVariants}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build`

Expected: Build succeeds.

---

### Task 13: Final Verification

**Files:** (none — verification-only)

- [ ] **Step 1: Run lint**

Run: `npm run lint`

Expected: No lint errors.

- [ ] **Step 2: Run typecheck + build**

Run: `npm run build`

Expected: `tsc -b` succeeds, `vite build` succeeds. No errors.

- [ ] **Step 3: Visual smoke test**

Run: `npm run dev`

Expected: Dev server starts. Open browser to verify:
- Animated gradient blobs visible behind content
- Fonts render: Space Grotesk on headings, JetBrains Mono on dates/metadata
- Hero text has parallax effect on scroll
- GlassCards tilt on mouse hover
- Skill badges float on mouse hover
- Section reveals fade in on scroll
- MenuBar hamburger shows Lucide Menu/X icons
- Contact buttons show Lucide icons
- Lightbox opens on project image click, navigates with arrows/keyboard, closes with Escape
- Dark mode still works correctly
- No console errors
