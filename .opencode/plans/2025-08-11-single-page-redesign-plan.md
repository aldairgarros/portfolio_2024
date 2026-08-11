# Single-Page Portfolio Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the portfolio into a single-page app with all project details inline, amplified glassmorphism visuals, and a minimal hamburger navbar.

**Architecture:** Remove the `/projects/:project` route. Extract project detail display into a reusable `ProjectDetail` component used 4x on the home page. Replace horizontal nav with a single hamburger button. Apply gradient accents, larger typography, and floating orbs throughout.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Framer Motion, react-router-dom v7, react-i18next, Lucide React

## Global Constraints

- Use `@/` path alias for all internal imports
- No hardcoded user-facing strings in components
- Keep scanlines and mouse crosshairs from BackgroundDecoration
- Keep code-as-UI aesthetic (GlassCard, SectionTitle with bracket styling)
- TypeScript strict mode — no unused locals or parameters
- `npm run build` must pass (typecheck + build)

---

### Task 1: Create ProjectDetail component

**Files:**
- Create: `src/modules/Projects/ProjectDetail.tsx`

**Interfaces:**
- Consumes: `GlassCard` from `@/components/GlassCard`, `SectionTitle` from `@/components/SectionTitle`, `Lightbox` + `LightboxImage` from `@/components/Lightbox`, `useTranslation` from `react-i18next`
- Produces: `export function ProjectDetail({ project }: { project: string }): React.JSX.Element`

- [ ] **Step 1: Create `src/modules/Projects/ProjectDetail.tsx`**

```tsx
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { SectionTitle } from "@/components/SectionTitle";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";

interface Props {
  project: string;
  tinted?: boolean;
}

export function ProjectDetail({ project, tinted = false }: Props): React.JSX.Element {
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
  const label = p("images.label");

  return (
    <section
      id={project}
      className={`py-24 px-4 sm:px-8 ${tinted ? "bg-accent-500/5" : ""}`}>
      <div className="max-w-6xl mx-auto">
        <SectionTitle title={p("name.value")} />

        <div className="flex flex-col gap-8">
          <span className="text-sm font-mono text-primary-500 dark:text-primary-400">
            {p("date.value")}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {linkHref && (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-full border border-amber-400/40 dark:border-amber-500/40 text-accent-600 dark:text-accent-400 hover:bg-gradient-to-r hover:from-amber-400 hover:to-rose-400 hover:text-white hover:border-transparent transition-all font-medium text-sm focus:ring-2 focus:ring-accent-500 focus:outline-none">
              {linkValue || tProjects("open")}
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          )}

          {imageData.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-primary-500 dark:text-primary-400 mb-4">
                {label}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageData.map((img, index) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    width={+img.width}
                    height={+img.height}
                    className="rounded-2xl object-contain w-full h-auto cursor-zoom-in hover:ring-2 hover:ring-amber-400/60 transition-all duration-200 bg-white dark:bg-transparent"
                    loading="lazy"
                    onClick={() => openLightbox(index)}
                  />
                ))}
              </div>
            </div>
          )}
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

- [ ] **Step 2: Commit**

```bash
git add src/modules/Projects/ProjectDetail.tsx
git commit -m "feat: add ProjectDetail component for inline project display"
```

---

### Task 2: Update home page with new section order

**Files:**
- Modify: `src/pages/home/index.tsx`

**Interfaces:**
- Consumes: `ProjectDetail` from Task 1, existing `Hero`, `About`, `Expertise`, `Education`, `Contact`
- Produces: N/A (home page component)

- [ ] **Step 1: Rewrite `src/pages/home/index.tsx`**

```tsx
import { About } from "@/modules/About";
import { Contact } from "@/modules/Contact";
import { Education } from "@/modules/Education";
import { Expertise } from "@/modules/Expertise";
import { Hero } from "@/modules/Hero";
import { ProjectDetail } from "@/modules/Projects/ProjectDetail";

const PROJECTS = ["atalaiaPro", "penhor", "bolsobom", "musicaShow"];

export function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <About />
      <Expertise />
      {PROJECTS.map((project, index) => (
        <ProjectDetail key={project} project={project} tinted={index % 2 !== 0} />
      ))}
      <Education />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/home/index.tsx
git commit -m "refactor: restructure home page with inline project details"
```

---

### Task 3: Update Layout and MenuBar — minimal hamburger nav

**Files:**
- Modify: `src/pages/Layout.tsx`
- Modify: `src/modules/MenuBar/index.tsx`
- Modify: `src/modules/MenuBar/FullScreenMenu.tsx`

**Interfaces:**
- Consumes: `MenuBar` receives updated SECTIONS, always shows hamburger
- Produces: Same exports (`RootLayout`, `MenuBar`)

- [ ] **Step 1: Update `src/pages/Layout.tsx`**

Project keys don't have a top-level `title` translation — use the project name from `projects.list` instead.

```tsx
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MenuBar } from "@/modules/MenuBar";
import { BackgroundDecoration } from "@/components/BackgroundDecoration";

const TOP_SECTIONS = ["home", "about", "expertise"] as const;
const PROJECT_SECTIONS = ["atalaiaPro", "penhor", "bolsobom", "musicaShow"] as const;
const BOTTOM_SECTIONS = ["education", "contact"] as const;

export function RootLayout() {
  const { t } = useTranslation("translation");

  const links = [
    ...TOP_SECTIONS.map((id) => ({ label: t(`${id}.title`), hash: id })),
    ...PROJECT_SECTIONS.map((id) => ({ label: t(`projects.list.${id}.name.value`), hash: id })),
    ...BOTTOM_SECTIONS.map((id) => ({ label: t(`${id}.title`), hash: id })),
  ];

  return (
    <div className="flex items-center justify-center">
      <MenuBar links={links} />
      <BackgroundDecoration />
      <Outlet />
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `src/modules/MenuBar/index.tsx` — always show hamburger**

```tsx
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollRestoration } from "react-router-dom";
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
      <nav className="fixed top-0 flex justify-end w-full z-30" role="navigation" aria-label="Main navigation">
        <button
          className="flex items-center justify-center w-12 h-12 cursor-pointer select-none focus:ring-2 focus:ring-amber-400 focus:outline-none rounded-full m-4 backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10"
          onClick={() => setIsMenuOpen((state) => !state)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}>
          {isMenuOpen ? (
            <X size={20} className="text-primary-900 dark:text-primary-50" />
          ) : (
            <Menu size={20} className="text-primary-900 dark:text-primary-50" />
          )}
        </button>
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

- [ ] **Step 3: Update `src/modules/MenuBar/FullScreenMenu.tsx` — fix translation key for new sections**

The new SECTIONS include project keys (`atalaiaPro`, `penhor`, etc.) which don't have a `title` key. The label from Layout.tsx uses `t("${id}.title", id)` which falls back to the id. FullScreenMenu should use the label as-is from the `links` prop — no changes needed since it already uses `link.label`.

No changes needed to FullScreenMenu.tsx.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Layout.tsx src/modules/MenuBar/index.tsx
git commit -m "refactor: replace horizontal nav with minimal hamburger menu"
```

---

### Task 4: Update router and delete old files

**Files:**
- Modify: `src/router.tsx`
- Delete: `src/pages/project/index.tsx`
- Delete: `src/modules/Projects/ProjectList.tsx`
- Delete: `src/modules/Projects/ProjectCard.tsx`
- Delete: `src/modules/Projects/index.tsx` (old grid, unused after Task 2)

- [ ] **Step 1: Update `src/router.tsx` — remove Project route**

```tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./pages/Layout";
import { Home } from "./pages/home";

export default function AppRouter() {
  const root = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        { path: "/", element: <Home /> },
      ],
    },
  ]);

  return <RouterProvider router={root} />;
}
```

- [ ] **Step 2: Delete old files**

```bash
rm src/pages/project/index.tsx
rmdir src/pages/project 2>/dev/null || true
rm src/modules/Projects/index.tsx
rm src/modules/Projects/ProjectList.tsx
rm src/modules/Projects/ProjectCard.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/router.tsx
git rm src/pages/project/index.tsx src/modules/Projects/index.tsx src/modules/Projects/ProjectList.tsx src/modules/Projects/ProjectCard.tsx
git commit -m "refactor: remove project route and unused components"
```

---

### Task 5: Visual design — SectionTitle and GlassCard

**Files:**
- Modify: `src/components/SectionTitle/index.tsx`
- Modify: `src/components/GlassCard/index.tsx`

- [ ] **Step 1: Update `src/components/SectionTitle/index.tsx` — larger type, gradient underline**

```tsx
import { type LucideIcon } from "lucide-react";

interface Props {
  title: string;
  id?: string;
  icon?: LucideIcon;
}

export function SectionTitle({ title, id, icon: Icon }: Props) {
  return (
    <div className="mb-16">
      <h2
        id={id}
        className="text-5xl sm:text-7xl font-bold font-heading text-primary-900 dark:text-primary-50 flex items-center gap-3">
        {Icon && <Icon size={32} className="text-amber-400 shrink-0" />}
        {title}
      </h2>
      <div className="mt-3 h-1 w-24 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400 rounded-full" />
    </div>
  );
}
```

- [ ] **Step 2: Update `src/components/GlassCard/index.tsx` — rounded-3xl, p-8 default**

```tsx
import { HTMLAttributes } from "react";
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

  const baseClasses = `relative backdrop-blur-lg bg-white/10 dark:bg-white/5 rounded-3xl shadow-md p-8 ${
    hover ? "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" : ""
  } ${className}`;

  if (tilt) {
    return (
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={baseClasses}
        {...(rest as React.ComponentPropsWithoutRef<typeof motion.div>)}
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

- [ ] **Step 3: Commit**

```bash
git add src/components/SectionTitle/index.tsx src/components/GlassCard/index.tsx
git commit -m "style: amplify SectionTitle and GlassCard with gradients and larger type"
```

---

### Task 6: Visual design — Hero with gradient orbs

**Files:**
- Modify: `src/modules/Hero/index.tsx`

- [ ] **Step 1: Rewrite `src/modules/Hero/index.tsx`**

```tsx
import { GlassCard } from "@/components/GlassCard";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";

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
      {/* Gradient orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-400/20 dark:bg-amber-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-rose-400/20 dark:bg-rose-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-300/10 dark:bg-amber-400/10 rounded-full blur-3xl" />
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
            <GlassCard className="inline-flex items-center gap-2 px-5 py-2 border-amber-400/40 dark:border-amber-500/40">
              <span className="text-accent-600 dark:text-accent-400 text-sm font-semibold">{t("extras.available.label")}</span>
            </GlassCard>
            <GlassCard className="inline-flex items-center gap-2 px-5 py-2 border-amber-400/40 dark:border-amber-500/40">
              <span className="text-accent-600 dark:text-accent-400 text-sm font-semibold">
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

- [ ] **Step 2: Commit**

```bash
git add src/modules/Hero/index.tsx
git commit -m "style: amplify Hero with gradient orbs, larger heading, and gradient badge borders"
```

---

### Task 7: Visual design — About, Expertise, Education, Contact

**Files:**
- Modify: `src/modules/About/index.tsx`
- Modify: `src/modules/Expertise/index.tsx`
- Modify: `src/modules/Education/index.tsx`
- Modify: `src/modules/Contact/index.tsx`

- [ ] **Step 1: Update `src/modules/Education/index.tsx` — gradient left-border, p-8**

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
        transition={{ duration: 0.6 }}>
        <GlassCard hover className="max-w-2xl border-l-2 border-l-amber-400/60">
          <div className="flex items-start gap-4">
            <GraduationCap size={28} className="text-amber-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold font-heading text-primary-900 dark:text-primary-50">{t("course.title")}</h3>
              <p className="text-sm text-accent-600 dark:text-accent-400 mt-1">
                {t("course.institution")} &mdash; {t("course.period")}
              </p>
              <p className="mt-4 text-primary-700 dark:text-primary-300 leading-relaxed">{t("course.description")}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Update `src/modules/About/index.tsx` — gradient border, amber icons**

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
            <GlassCard hover className="p-8 border-l-2 border-l-amber-400/60">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <h3 className="text-xl font-semibold font-heading text-primary-900 dark:text-primary-50 flex items-center gap-2">
                  <Briefcase size={20} className="text-amber-400 shrink-0" />
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

- [ ] **Step 3: Update `src/modules/Contact/index.tsx` — gradient hover**

```tsx
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Globe, GitBranch } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";
import { useTranslation } from "react-i18next";

const ICON_MAP: Record<string, typeof Mail> = {
  email: Mail,
  phone: Phone,
  whatsApp: MessageCircle,
  linkedIn: Globe,
  github: GitBranch,
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
        <GlassCard className="flex items-center border-l-2 border-l-amber-400/60">
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
                className="inline-flex items-center gap-3 px-4 py-3 rounded-full border border-primary-200 dark:border-primary-700 text-sm text-primary-700 dark:text-primary-300 hover:bg-gradient-to-r hover:from-amber-400 hover:to-rose-400 hover:text-white hover:border-transparent transition-all focus:ring-2 focus:ring-amber-400 focus:outline-none"
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

- [ ] **Step 4: Update `src/modules/Expertise/index.tsx` — gradient top-border**

In the existing `GlassCard` element, add `border-t-2 border-t-amber-400/60` to the className:

```tsx
<GlassCard
  hover
  className={`p-8 border-t-2 border-t-amber-400/60 ${isLastOdd ? "md:col-span-2" : ""}`}>
```

No other changes needed to Expertise.

- [ ] **Step 5: Commit**

```bash
git add src/modules/Education/index.tsx src/modules/About/index.tsx src/modules/Contact/index.tsx
git commit -m "style: add gradient accents to Education, About, and Contact sections"
```

---

### Task 8: Verify build passes

- [ ] **Step 1: Run typecheck + build**

```bash
npm run build
```

Expected: `tsc -b` passes with no errors, `vite build` completes successfully.

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

Expected: No lint errors.

- [ ] **Step 3: Fix any issues found, then final verification commit**

If any issues found, fix and re-run build. Once passing:

```bash
git add -A && git commit -m "chore: final build verification after redesign"
```

---
