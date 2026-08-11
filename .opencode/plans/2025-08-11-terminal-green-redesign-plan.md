# Terminal-Professional Green Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the amber/rose aesthetic with an emerald-green + gray terminal-professional design: shadowed glass containers, CSS 3D cubes in the hero, redesigned menu with terminal-prompt button and always-visible language selector, vertical expertise layout with icon strips, and unified side-by-side project blocks.

**Architecture:** No structural/route changes. All changes are component-level visual redesigns across 12 files. Single page stays as-is.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Framer Motion, react-i18next, Lucide React

## Global Constraints

- Use `@/` path alias for all internal imports
- No hardcoded user-facing strings in components (decorative glyphs like `>_`, `█` are fine)
- TypeScript strict mode — no unused locals or parameters
- `React.JSX.Element` for explicit return types (React 19)
- `npm run build` must pass (typecheck + build); `npm run lint` must pass
- No new dependencies (CSS 3D cubes, no three.js)
- `prefers-reduced-motion` guards on all new animations
- Final state: ZERO `amber` or `rose` class references in src/

---

### Task 1: GlassCard + SectionTitle — shadowed glass, emerald underline

**Files:**
- Modify: `src/components/GlassCard/index.tsx`
- Modify: `src/components/SectionTitle/index.tsx`

**Interfaces:**
- Consumes: nothing new
- Produces: unchanged `GlassCard({ children, hover, tilt, className, ...rest })`; unchanged `SectionTitle({ title, id, icon })`

- [ ] **Step 1: Rewrite GlassCard base classes** — remove gradient pseudo-element border, use neutral border + emerald glow shadow

In `src/components/GlassCard/index.tsx:30`, replace the `baseClasses` line with:

```tsx
  const baseClasses = `relative backdrop-blur-lg bg-white/10 dark:bg-white/5 rounded-2xl border border-zinc-200/30 dark:border-zinc-700/20 shadow-lg dark:shadow-[0_0_30px_rgba(5,150,105,0.05)] p-6 ${
    hover ? "hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300" : ""
  } ${className}`;
```

- [ ] **Step 2: Rewrite SectionTitle** — emerald underline, tighter type

Replace the entire return block in `src/components/SectionTitle/index.tsx` with:

```tsx
  return (
    <div className="mb-16">
      <h2
        id={id}
        className="text-4xl sm:text-5xl font-bold font-heading text-primary-900 dark:text-primary-50 flex items-center gap-3">
        {Icon && <Icon size={28} className="text-emerald-400 shrink-0" />}
        {title}
      </h2>
      <div className="mt-3 h-1 w-16 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" />
    </div>
  );
```

- [ ] **Step 3: Verify + commit**

```bash
npm run build
git add src/components/GlassCard/index.tsx src/components/SectionTitle/index.tsx
git commit -m "style: replace amber borders with emerald-accented shadowed glass"
```

---

### Task 2: Hero — CSS 3D cubes replace gradient orbs

**Files:**
- Modify: `src/modules/Hero/index.tsx`

**Interfaces:**
- Consumes: existing hero translations, existing motion logic
- Produces: local `Cube` component (module-private), unchanged `Hero` export

- [ ] **Step 1: Rewrite `src/modules/Hero/index.tsx`**

Complete file:

```tsx
import { GlassCard } from "@/components/GlassCard";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";

interface CubeProps {
  size: number;
  speedX: number;
  speedY: number;
}

function Cube({ size, speedX, speedY }: CubeProps) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  useAnimationFrame((time) => {
    if (prefersReducedMotion) return;
    rotateX.set((time / 1000) * speedX);
    rotateY.set((time / 1000) * speedY);
  });

  const half = size / 2;
  const faces = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", width: size, height: size }}
      aria-hidden="true">
      {faces.map((transform, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            transform,
            backfaceVisibility: "hidden",
            border: "1px solid rgb(16 185 129 / 0.4)",
            background: "rgb(16 185 129 / 0.04)",
          }}
        />
      ))}
    </motion.div>
  );
}

export function Hero() {
  const { t } = useTranslation("translation", { keyPrefix: "hero" });
  const prefersReducedMotion = useReducedMotion();
  const isPointerFine = window.matchMedia("(pointer: fine)").matches;

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 80, damping: 15 });
  const springY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-12, 12]), { stiffness: 80, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !isPointerFine) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center max-h-256 h-screen px-4 text-center overflow-hidden"
      onMouseMove={handleMouseMove}>
      {/* CSS 3D cubes */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-[12%] -translate-y-1/2 opacity-20 blur-[1px] hidden sm:block">
          <Cube size={80} speedX={0} speedY={45} />
        </div>
        <div className="absolute top-1/2 right-[12%] -translate-y-1/2 opacity-20 blur-[1px] hidden sm:block">
          <Cube size={110} speedX={35} speedY={55} />
        </div>
      </div>

      <motion.div
        style={{ y: prefersReducedMotion ? 0 : heroY, opacity: prefersReducedMotion ? 1 : heroOpacity }}
        className="relative z-10">
        <div className="relative">
          <motion.h1
            className="text-7xl sm:text-9xl font-bold font-heading tracking-tight text-primary-900 dark:text-primary-50 mb-6"
            style={{ x: prefersReducedMotion ? 0 : springX, y: prefersReducedMotion ? 0 : springY }}>
            {t("title.value")}
          </motion.h1>
          <div className="mt-8 flex justify-center">
            <p className="text-lg sm:text-xl text-primary-600 dark:text-primary-400 max-w-2xl mx-auto leading-relaxed">
              {t("subtitle.value")}
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <GlassCard className="inline-flex items-center gap-2 px-5 py-2 border-emerald-400/40 dark:border-emerald-500/40">
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">{t("extras.available.label")}</span>
            </GlassCard>
            <GlassCard className="inline-flex items-center gap-2 px-5 py-2 border-emerald-400/40 dark:border-emerald-500/40">
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                {t("extras.artificialIntelligence.label")}
              </span>
            </GlassCard>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run build
git add src/modules/Hero/index.tsx
git commit -m "style: replace hero orbs with rotating CSS 3D cubes"
```

---

### Task 3: MenuBar + FullScreenMenu + Layout — terminal prompt, always-visible lang toggle

**Files:**
- Modify: `src/modules/MenuBar/index.tsx`
- Modify: `src/modules/MenuBar/FullScreenMenu.tsx`
- Modify: `src/pages/Layout.tsx`

**Interfaces:**
- Consumes: `links` prop unchanged; `home.menuOpen`/`home.menuClose` translations (already exist); `hero.title.value`
- Produces: unchanged `MenuBar({ links })`, `FullScreenMenu({ open, links, currentLanguage, onLanguageChange, onClick })`, `RootLayout`

- [ ] **Step 1: Rewrite `src/modules/MenuBar/index.tsx`**

Complete file:

```tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, ScrollRestoration } from "react-router-dom";
import { FullScreenMenu } from "./FullScreenMenu";

interface LinkItem {
  label: string;
  hash: string;
}

interface Props {
  links: LinkItem[];
}

export function MenuBar({ links }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { i18n, t } = useTranslation();
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
        className="fixed top-0 w-full z-30 border-b border-zinc-200/30 dark:border-zinc-700/20 backdrop-blur-lg bg-white/10 dark:bg-white/5"
        role="navigation"
        aria-label="Main navigation">
        <div className="max-w-6xl mx-auto h-14 flex items-center justify-between px-4 sm:px-8">
          <Link
            to={{ pathname: "/", hash: "hero" }}
            className="flex items-center gap-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none rounded">
            <span className="font-mono text-sm font-semibold text-emerald-500 dark:text-emerald-400">&gt;_</span>
            <span className="font-heading font-medium text-primary-900 dark:text-primary-50">
              {t("hero.title.value")}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-primary-300 dark:border-primary-600 overflow-hidden">
              {(["en", "br"] as const).map((lang) => (
                <button
                  key={lang}
                  className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                    language === lang
                      ? "bg-emerald-500 text-white"
                      : "text-primary-600 dark:text-primary-400 hover:text-emerald-500 dark:hover:text-emerald-400"
                  }`}
                  onClick={() => handleLanguageChange(lang)}
                  aria-label={lang === "en" ? "Switch to English" : "Mudar para português"}
                  aria-pressed={language === lang}>
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-400/40 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors font-mono text-sm cursor-pointer select-none focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              onClick={() => setIsMenuOpen((state) => !state)}
              aria-label={isMenuOpen ? t("home.menuClose") : t("home.menuOpen")}
              aria-expanded={isMenuOpen}>
              <span>&gt;_</span>
              <span className={isMenuOpen ? "" : "animate-pulse"}>█</span>
            </button>
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

- [ ] **Step 2: Update `src/modules/MenuBar/FullScreenMenu.tsx`** — emerald hover + active

Change line 28 className: `hover:text-accent-600 dark:hover:text-accent-400` → `hover:text-emerald-600 dark:hover:text-emerald-400` and `focus:ring-accent-500` → `focus:ring-emerald-400`.

Change lines 41-47: `focus:ring-accent-500` → `focus:ring-emerald-400`; active `bg-accent-500 text-white` → `bg-emerald-500 text-white`.

- [ ] **Step 3: Update `src/pages/Layout.tsx`** — remove "home" section

Change line 6 from `const TOP_SECTIONS = ["home", "about", "expertise"] as const;` to `const TOP_SECTIONS = ["about", "expertise"] as const;`

- [ ] **Step 4: Verify + commit**

```bash
npm run build
git add src/modules/MenuBar/index.tsx src/modules/MenuBar/FullScreenMenu.tsx src/pages/Layout.tsx
git commit -m "refactor: redesign menu with terminal prompt button and persistent language toggle"
```

---

### Task 4: Expertise + Skill — vertical layout, mounted icon strip

**Files:**
- Modify: `src/modules/Expertise/index.tsx`
- Modify: `src/modules/Expertise/Skill.tsx`

**Interfaces:**
- Produces: unchanged `Expertise`, `Skill({ expertise, skill })`

- [ ] **Step 1: Rewrite `src/modules/Expertise/index.tsx`**

Complete file:

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
        className="flex flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {expertise.map((capability) => (
          <motion.div key={capability.id} variants={itemVariants}>
            <GlassCard hover>
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
              <div className="flex flex-wrap gap-x-8 gap-y-4 mt-8 border-t border-zinc-200/30 dark:border-zinc-700/20 pt-6">
                {capability.tech.map((tech) => (
                  <Skill key={tech} expertise={capability.id} skill={tech} />
                ))}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Rewrite `src/modules/Expertise/Skill.tsx`** — no card wrapper, grayscale to color

Complete file:

```tsx
import { useTranslation } from "react-i18next";

interface Props {
  expertise: string;
  skill: string;
}

export function Skill({ expertise, skill }: Props): React.JSX.Element {
  const { t } = useTranslation("translation", { keyPrefix: "expertise" });

  return (
    <div className="flex flex-col items-center gap-1.5 cursor-default">
      <img
        src={`skill_images/${t(`list.${expertise}.list.${skill}.imageSrc`)}`}
        alt={t(`list.${expertise}.list.${skill}.label`)}
        width={48}
        height={48}
        loading="lazy"
        className="w-12 h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
      />
      <span className="text-xs text-center text-primary-600 dark:text-primary-400 leading-tight">
        {t(`list.${expertise}.list.${skill}.label`)}
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Verify + commit**

```bash
npm run build
git add src/modules/Expertise/index.tsx src/modules/Expertise/Skill.tsx
git commit -m "style: vertical expertise layout with icon strips"
```

---

### Task 5: ProjectDetail + home — unified side-by-side project blocks

**Files:**
- Modify: `src/modules/Projects/ProjectDetail.tsx`
- Modify: `src/pages/home/index.tsx`

**Interfaces:**
- Produces: `ProjectDetail({ project, flip })` — `flip?: boolean` replaces `tinted?: boolean`
- Consumes: updated home page passes `flip={index % 2 !== 0}`

- [ ] **Step 1: Rewrite `src/modules/Projects/ProjectDetail.tsx`**

Complete file:

```tsx
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";

interface Props {
  project: string;
  flip?: boolean;
}

export function ProjectDetail({ project, flip = false }: Props): React.JSX.Element {
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
  const mainSrc = p("image.src");
  const mainAlt = p("image.alt");

  return (
    <section id={project} className="py-24 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title={p("name.value")} />

        <div className="rounded-2xl backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-zinc-200/30 dark:border-zinc-700/20 shadow-lg dark:shadow-[0_0_30px_rgba(5,150,105,0.05)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
            <div className={`flex flex-col justify-center ${flip ? "md:order-2" : ""}`}>
              <img
                src={mainSrc}
                alt={mainAlt}
                width={600}
                height={400}
                className="w-full h-auto object-contain rounded-xl bg-white dark:bg-transparent cursor-zoom-in hover:ring-2 hover:ring-emerald-400/50 transition-all duration-200"
                loading="lazy"
                onClick={() => openLightbox(0)}
              />
            </div>

            <div className="flex flex-col justify-center gap-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold font-heading text-primary-900 dark:text-primary-50">
                  {p("name.value")}
                </h3>
                <span className="text-sm font-mono text-primary-500 dark:text-primary-400 shrink-0">
                  {p("date.value")}
                </span>
              </div>

              <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
                {p("description.value")}
              </p>

              <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
                {p("details.value")}
              </p>

              {linkHref && (
                <a
                  href={linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-full border border-emerald-400/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-transparent transition-all font-medium text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none">
                  {linkValue || tProjects("open")}
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              )}

              {imageData.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {imageData.map((img, index) => (
                    <img
                      key={img.src}
                      src={img.src}
                      alt={img.alt}
                      width={+img.width}
                      height={+img.height}
                      className="rounded-lg object-contain w-full h-auto cursor-zoom-in hover:ring-2 hover:ring-emerald-400/50 transition-all duration-200 bg-white dark:bg-transparent"
                      loading="lazy"
                      onClick={() => openLightbox(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
```

- [ ] **Step 2: Update `src/pages/home/index.tsx`** — flip instead of tinted

Change the ProjectDetail usage from `tinted={index % 2 !== 0}` to `flip={index % 2 !== 0}`.

- [ ] **Step 3: Verify + commit**

```bash
npm run build
git add src/modules/Projects/ProjectDetail.tsx src/pages/home/index.tsx
git commit -m "style: unified side-by-side project blocks"
```

---

### Task 6: Education, About, Contact — emerald accents

**Files:**
- Modify: `src/modules/Education/index.tsx`
- Modify: `src/modules/About/index.tsx`
- Modify: `src/modules/Contact/index.tsx`

- [ ] **Step 1: Education** (`src/modules/Education/index.tsx`)

Change line 18: `border-l-2 border-l-amber-400/60` → `border-l-2 border-l-emerald-400/40`
Change line 20: `text-amber-400` → `text-emerald-400`

- [ ] **Step 2: About** (`src/modules/About/index.tsx`)

Change line 29: `border-l-2 border-l-amber-400/60` → `border-l-2 border-l-emerald-400/40`
Change line 32: `text-amber-400` → `text-emerald-400`

- [ ] **Step 3: Contact** (`src/modules/Contact/index.tsx`)

Change line 31: `border-l-2 border-l-amber-400/60` → `border-l-2 border-l-emerald-400/40`
Change line 52 className: `hover:bg-gradient-to-r hover:from-amber-400 hover:to-rose-400 hover:text-white hover:border-transparent transition-all focus:ring-2 focus:ring-amber-400` → `hover:bg-emerald-500 hover:text-white hover:border-transparent transition-all focus:ring-2 focus:ring-emerald-400`

- [ ] **Step 4: Verify + commit**

```bash
npm run build
git add src/modules/Education/index.tsx src/modules/About/index.tsx src/modules/Contact/index.tsx
git commit -m "style: emerald accents in Education, About, and Contact"
```

---

### Task 7: Final verification — no amber/rose anywhere

- [ ] **Step 1: Grep for leftover amber/rose**

```bash
grep -rn "amber\|rose" src/ || echo "CLEAN"
```

Expected: `CLEAN` (or only matches in `src/assets/` images if any — check they are binary/image refs only, not class names).

- [ ] **Step 2: Build + lint**

```bash
npm run build && npm run lint
```

Expected: tsc passes, vite builds, eslint clean.

- [ ] **Step 3: Fix anything found, commit**

```bash
git add -A
git commit -m "chore: final verification after green redesign" || echo "nothing to commit"
```
