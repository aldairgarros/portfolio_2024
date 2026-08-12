# MenuBar Dynamic Address Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace sticky terminal titles with a dynamic terminal-style path in the MenuBar that reflects the most visible section/card while scrolling.

**Architecture:** An `ActiveSectionProvider` (new file `src/context/ActiveSectionContext.tsx`) runs a single `IntersectionObserver`. Sections and panels register themselves via a `useActiveSection(path)` hook returning a ref callback; the provider tracks the highest-intersection-ratio registered element and exposes its path via context. MenuBar consumes it and renders `@user:<path>` with a CSS fade-in on change. The sticky-title commit `7e8b624` is reverted.

**Tech Stack:** React 19.2 (ref-as-prop and ref-callback cleanup supported natively), TypeScript strict, Tailwind CSS v4, react-i18next.

## Global Constraints

- Path segments are slugified, lowercase, hyphenated — file-system-like, language-independent (same in both locales).
- No new dependencies.
- No test suite exists — verify each task with `npm run build` (typecheck + vite) and `npm run lint`.
- `@/` alias resolves to `src/`; use it for all internal imports.
- React 19: `JSX` is no longer a global namespace; do not use it.

---

### Task 1: Revert sticky titles and add ref support to TerminalPanel

**Files:**

- Modify: `src/components/TerminalFrame/index.tsx`

**Interfaces:**

- Consumes: (none)
- Produces: `TerminalPanel` accepts an optional `ref?: Ref<HTMLDivElement>` prop. `TerminalFrame` title bar no longer sticky.

- [ ] **Step 1: Remove sticky classes from TerminalFrame title bar**

Edit `src/components/TerminalFrame/index.tsx` line 17. Change:

```tsx
<div className="flex items-center border-b border-zinc-400/80 dark:border-zinc-600/70 bg-zinc-100/70 dark:bg-zinc-800/40 px-4 py-2.5 sticky top-14 z-20 backdrop-blur-md">
```

to:

```tsx
<div className="flex items-center border-b border-zinc-400/80 dark:border-zinc-600/70 bg-zinc-100/70 dark:bg-zinc-800/40 px-4 py-2.5">
```

- [ ] **Step 2: Remove sticky classes from TerminalPanel title bar**

Edit `src/components/TerminalFrame/index.tsx` line 43. Change:

```tsx
<div className="flex items-center gap-2 border-b border-zinc-400/80 dark:border-zinc-600/70 bg-zinc-100/70 dark:bg-zinc-800/40 px-4 py-2.5 min-w-0 sticky top-[6.25rem] z-10 backdrop-blur-md">
```

to:

```tsx
<div className="flex items-center gap-2 border-b border-zinc-400/80 dark:border-zinc-600/70 bg-zinc-100/70 dark:bg-zinc-800/40 px-4 py-2.5 min-w-0">
```

- [ ] **Step 3: Add ref prop to TerminalPanel**

Edit `src/components/TerminalFrame/index.tsx`. Change the import (line 1):

```tsx
import { type ReactNode } from "react";
```

to:

```tsx
import { type ReactNode, type Ref } from "react";
```

Change the `TerminalPanelProps` interface (lines 34-38):

```tsx
interface TerminalPanelProps {
  title: ReactNode;
  className?: string;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}
```

Change the `TerminalPanel` function signature and root div (lines 40-42):

```tsx
export function TerminalPanel({ title, className = "", children, ref }: TerminalPanelProps) {
  return (
    <div ref={ref} className={`font-mono ${PANEL} ${className}`}>
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: typecheck and vite build succeed, no errors.
Run: `npm run lint`
Expected: no lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/TerminalFrame/index.tsx
git commit -m "revert: remove sticky terminal titles, add ref support to TerminalPanel"
```

---

### Task 2: Create ActiveSectionContext

**Files:**

- Create: `src/context/ActiveSectionContext.tsx`

**Interfaces:**

- Consumes: (none — standalone)
- Produces:
  - `<ActiveSectionProvider>` — wraps children; must wrap both MenuBar and the page outlet in `RootLayout`
  - `useActiveSection(path: string): RefCallback<HTMLElement>` — registers an element; returns cleanup (React 19 ref-callback cleanup)
  - `useActivePath(): string | null` — current highest-ratio visible element's path, `null` when none visible

- [ ] **Step 1: Write the context file**

Create `src/context/ActiveSectionContext.tsx` with exactly:

```tsx
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefCallback,
} from "react";

interface ActiveSectionContextValue {
  activePath: string | null;
  register: (element: HTMLElement, path: string) => () => void;
}

const ActiveSectionContext = createContext<ActiveSectionContextValue | null>(null);

const THRESHOLDS = [0, 0.25, 0.5, 0.75, 1.0];
const ROOT_MARGIN = "0px 0px -10% 0px";

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [activePath, setActivePath] = useState<string | null>(null);
  const entriesRef = useRef(new Map<Element, { path: string; ratio: number }>());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback((updates: IntersectionObserverEntry[]) => {
    const entries = entriesRef.current;
    for (const update of updates) {
      const entry = entries.get(update.target);
      if (entry) entry.ratio = update.intersectionRatio;
    }
    let bestPath: string | null = null;
    let bestRatio = 0;
    for (const { path, ratio } of entries.values()) {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestPath = path;
      }
    }
    setActivePath(bestPath);
  }, []);

  const register = useCallback(
    (element: HTMLElement, path: string) => {
      if (!observerRef.current) {
        observerRef.current = new IntersectionObserver(handleIntersect, {
          root: null,
          rootMargin: ROOT_MARGIN,
          threshold: THRESHOLDS,
        });
      }
      entriesRef.current.set(element, { path, ratio: 0 });
      observerRef.current.observe(element);
      return () => {
        observerRef.current?.unobserve(element);
        entriesRef.current.delete(element);
      };
    },
    [handleIntersect],
  );

  const value = useMemo(() => ({ activePath, register }), [activePath, register]);

  return <ActiveSectionContext.Provider value={value}>{children}</ActiveSectionContext.Provider>;
}

export function useActivePath(): string | null {
  const context = useContext(ActiveSectionContext);
  if (!context) throw new Error("useActivePath must be used within ActiveSectionProvider");
  return context.activePath;
}

export function useActiveSection(path: string): RefCallback<HTMLElement> {
  const context = useContext(ActiveSectionContext);
  if (!context) throw new Error("useActiveSection must be used within ActiveSectionProvider");
  const { register } = context;
  return useCallback(
    (element: HTMLElement | null) => {
      if (element) return register(element, path);
    },
    [register, path],
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: typecheck and vite build succeed, no errors.
Run: `npm run lint`
Expected: no lint errors.

- [ ] **Step 3: Commit**

```bash
git add src/context/ActiveSectionContext.tsx
git commit -m "feat: add ActiveSectionContext with IntersectionObserver path tracking"
```

---

### Task 3: Wrap layout in provider, render dynamic path in MenuBar

**Files:**

- Modify: `src/pages/Layout.tsx`
- Modify: `src/modules/MenuBar/index.tsx`
- Modify: `src/globals.css`

**Interfaces:**

- Consumes: `ActiveSectionProvider`, `useActivePath` from Task 2
- Produces: MenuBar renders `@{username}:<path>` where `<path>` is `~` when no section is active; adds `fade-in` animation utility `animate-fade-in`

- [ ] **Step 1: Wrap RootLayout in ActiveSectionProvider**

Edit `src/pages/Layout.tsx`. Change the import (lines 1-5):

```tsx
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MenuBar, type NavItem } from "@/modules/MenuBar";
import { BackgroundDecoration } from "@/components/BackgroundDecoration";
import { ContactFooter } from "@/modules/Contact";
```

to:

```tsx
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MenuBar, type NavItem } from "@/modules/MenuBar";
import { BackgroundDecoration } from "@/components/BackgroundDecoration";
import { ContactFooter } from "@/modules/Contact";
import { ActiveSectionProvider } from "@/context/ActiveSectionContext";
```

Change the JSX (lines 24-31):

```tsx
return (
  <div className="flex items-center justify-center">
    <MenuBar links={links} />
    <BackgroundDecoration />
    <Outlet />
    <ContactFooter />
  </div>
);
```

to:

```tsx
return (
  <ActiveSectionProvider>
    <div className="flex items-center justify-center">
      <MenuBar links={links} />
      <BackgroundDecoration />
      <Outlet />
      <ContactFooter />
    </div>
  </ActiveSectionProvider>
);
```

- [ ] **Step 2: Add fade-in keyframe to globals.css**

Edit `src/globals.css`. After the scan line keyframes block (after line 127), add:

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

- [ ] **Step 3: Render dynamic path in MenuBar**

Edit `src/modules/MenuBar/index.tsx`. Change the import (line 4):

```tsx
import { TerminalFrame, TerminalSeparator } from "@/components/TerminalFrame";
```

to:

```tsx
import { TerminalFrame, TerminalSeparator } from "@/components/TerminalFrame";
import { useActivePath } from "@/context/ActiveSectionContext";
```

Inside the component, after `const { language, changeLanguage } = i18n;` (line 21), add:

```tsx
const activePath = useActivePath();
```

Change the brand Link (lines 55-59):

```tsx
<Link
  to={{ pathname: "/", hash: "hero" }}
  className="font-bold text-emerald-500 dark:text-emerald-400 hover:text-emerald-400 focus:ring-2 focus:ring-emerald-400 focus:outline-none"
>
  @{t("hero.title.value")}:~
</Link>
```

to:

```tsx
<Link
  to={{ pathname: "/", hash: "hero" }}
  className="font-bold text-emerald-500 dark:text-emerald-400 hover:text-emerald-400 focus:ring-2 focus:ring-emerald-400 focus:outline-none min-w-0 truncate"
>
  @{t("hero.title.value")}:
  <span key={activePath ?? "~"} className="animate-fade-in">
    {activePath ?? "~"}
  </span>
</Link>
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: typecheck and vite build succeed, no errors.
Run: `npm run lint`
Expected: no lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Layout.tsx src/modules/MenuBar/index.tsx src/globals.css
git commit -m "feat: show active section path in menubar with fade animation"
```

---

### Task 4: Register section-level tracking (Hero, About, Education)

**Files:**

- Modify: `src/modules/Hero/index.tsx`
- Modify: `src/modules/About/index.tsx`
- Modify: `src/modules/Education/index.tsx`

**Interfaces:**

- Consumes: `useActiveSection(path: string)` from Task 2
- Produces: Hero registers `"~"`, About registers `"~/about"`, Education registers `"~/education"`

- [ ] **Step 1: Register Hero section**

Edit `src/modules/Hero/index.tsx`. Change the import (line 3):

```tsx
import { TerminalFrame } from "@/components/TerminalFrame";
```

to:

```tsx
import { TerminalFrame } from "@/components/TerminalFrame";
import { useActiveSection } from "@/context/ActiveSectionContext";
```

Inside the component, after `const isPointerFine = window.matchMedia("(pointer: fine)").matches;` (line 55), add:

```tsx
const sectionRef = useActiveSection("~");
```

Change the section element (lines 74-77):

```tsx
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center max-h-256 h-screen px-4 text-center overflow-hidden"
      onMouseMove={handleMouseMove}>
```

to:

```tsx
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center max-h-256 h-screen px-4 text-center overflow-hidden"
      onMouseMove={handleMouseMove}>
```

- [ ] **Step 2: Register About section**

Edit `src/modules/About/index.tsx`. Change the import (line 3):

```tsx
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";
```

to:

```tsx
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";
import { useActiveSection } from "@/context/ActiveSectionContext";
```

Inside the component, after `const LIST = ["experience1", "experience2"];` (line 13), add:

```tsx
const sectionRef = useActiveSection("~/about");
```

Change the section element (line 16):

```tsx
    <section id="about" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
```

to:

```tsx
    <section id="about" ref={sectionRef} className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
```

- [ ] **Step 3: Register Education section**

Edit `src/modules/Education/index.tsx`. Change the import (line 3):

```tsx
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";
```

to:

```tsx
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";
import { useActiveSection } from "@/context/ActiveSectionContext";
```

Inside the component, after `const { t } = useTranslation("translation", { keyPrefix: "education" });` (line 6), add:

```tsx
const sectionRef = useActiveSection("~/education");
```

Change the section element (line 9):

```tsx
    <section id="education" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
```

to:

```tsx
    <section id="education" ref={sectionRef} className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
```

- [ ] **Step 4: Verify**

Run: `npm run build`
Expected: typecheck and vite build succeed, no errors.
Run: `npm run lint`
Expected: no lint errors.

- [ ] **Step 5: Commit**

```bash
git add src/modules/Hero/index.tsx src/modules/About/index.tsx src/modules/Education/index.tsx
git commit -m "feat: track hero, about and education sections in menubar path"
```

---

### Task 5: Register projects section and project panels

**Files:**

- Modify: `src/pages/home/index.tsx`

**Interfaces:**

- Consumes: `useActiveSection(path: string)` from Task 2, `TerminalPanel` `ref` prop from Task 1
- Produces: Projects section registers `"~/projects"`; each project panel registers `~/projects/<slug>` (`atalaia-pro`, `penhor`, `bolso-bom`, `musica-show`)

- [ ] **Step 1: Register section and panels**

Edit `src/pages/home/index.tsx`. Change the import (line 7):

```tsx
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";
```

to:

```tsx
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";
import { useActiveSection } from "@/context/ActiveSectionContext";
```

Change the constant and component opening (lines 9-13):

```tsx
const PROJECTS = ["atalaiaPro", "penhor", "bolsobom", "musicaShow"];

export function Home() {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });
```

to:

```tsx
const PROJECTS = ["atalaiaPro", "penhor", "bolsobom", "musicaShow"] as const;

const PROJECT_PATHS: Record<(typeof PROJECTS)[number], string> = {
  atalaiaPro: "~/projects/atalaia-pro",
  penhor: "~/projects/penhor",
  bolsobom: "~/projects/bolso-bom",
  musicaShow: "~/projects/musica-show",
};

export function Home() {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });
  const projectsRef = useActiveSection("~/projects");
  const projectRefs = {
    atalaiaPro: useActiveSection(PROJECT_PATHS.atalaiaPro),
    penhor: useActiveSection(PROJECT_PATHS.penhor),
    bolsobom: useActiveSection(PROJECT_PATHS.bolsobom),
    musicaShow: useActiveSection(PROJECT_PATHS.musicaShow),
  };
```

Change the projects section (lines 19-38):

```tsx
<section id="projects" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
  <h2 className="sr-only">{t("title")}</h2>
  <TerminalFrame title={t("title")}>
    <div className="flex flex-col gap-6 p-6 sm:p-8">
      {PROJECTS.map((project) => (
        <TerminalPanel
          key={project}
          title={
            <span className="inline-flex items-center gap-3">
              {t(`list.${project}.name.value`)}
              <span className="text-xs text-primary-500 dark:text-primary-400">
                {t(`list.${project}.date.value`)}
              </span>
            </span>
          }
        >
          <ProjectDetail project={project} />
        </TerminalPanel>
      ))}
    </div>
  </TerminalFrame>
</section>
```

to:

```tsx
<section id="projects" ref={projectsRef} className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
  <h2 className="sr-only">{t("title")}</h2>
  <TerminalFrame title={t("title")}>
    <div className="flex flex-col gap-6 p-6 sm:p-8">
      {PROJECTS.map((project) => (
        <TerminalPanel
          key={project}
          ref={projectRefs[project]}
          title={
            <span className="inline-flex items-center gap-3">
              {t(`list.${project}.name.value`)}
              <span className="text-xs text-primary-500 dark:text-primary-400">
                {t(`list.${project}.date.value`)}
              </span>
            </span>
          }
        >
          <ProjectDetail project={project} />
        </TerminalPanel>
      ))}
    </div>
  </TerminalFrame>
</section>
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: typecheck and vite build succeed, no errors.
Run: `npm run lint`
Expected: no lint errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/home/index.tsx
git commit -m "feat: track projects section and cards in menubar path"
```

---

### Task 6: Register expertise section and capability panels

**Files:**

- Modify: `src/modules/Expertise/index.tsx`

**Interfaces:**

- Consumes: `useActiveSection(path: string)` from Task 2, `TerminalPanel` `ref` prop from Task 1
- Produces: Expertise section registers `"~/expertise"`; each capability panel registers `~/expertise/<id>` (ids from `src/assets/expertise.json`: `api-backend`, `frontend-engineering`, `mobile`, `devops`, `ux-strategy`)

- [ ] **Step 1: Register section and panels**

Edit `src/modules/Expertise/index.tsx`. Change the import (line 3):

```tsx
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";
```

to:

```tsx
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";
import { useActiveSection } from "@/context/ActiveSectionContext";
```

Inside the component, after `const { t } = useTranslation("translation", { keyPrefix: "expertise" });` (line 20), add:

```tsx
const sectionRef = useActiveSection("~/expertise");
const capabilityRefs = {
  "api-backend": useActiveSection("~/expertise/api-backend"),
  "frontend-engineering": useActiveSection("~/expertise/frontend-engineering"),
  mobile: useActiveSection("~/expertise/mobile"),
  devops: useActiveSection("~/expertise/devops"),
  "ux-strategy": useActiveSection("~/expertise/ux-strategy"),
};
```

Change the section element (line 23):

```tsx
    <section id="expertise" className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
```

to:

```tsx
    <section id="expertise" ref={sectionRef} className="py-20 px-4 sm:px-8 max-w-6xl mx-auto">
```

Change the capability panel render (lines 34-37):

```tsx
          {expertise.map((capability, index) => (
            <motion.div key={capability.id} variants={itemVariants} transition={{ delay: index * 0.1 }}>
              <TerminalPanel title={t(`list.${capability.id}.title`)}>
```

to:

```tsx
          {expertise.map((capability, index) => (
            <motion.div key={capability.id} ref={capabilityRefs[capability.id as keyof typeof capabilityRefs]} variants={itemVariants} transition={{ delay: index * 0.1 }}>
              <TerminalPanel title={t(`list.${capability.id}.title`)}>
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: typecheck and vite build succeed, no errors.
Run: `npm run lint`
Expected: no lint errors.

- [ ] **Step 3: Commit**

```bash
git add src/modules/Expertise/index.tsx
git commit -m "feat: track expertise section and categories in menubar path"
```

---

### Task 7: Manual end-to-end verification

**Files:**

- (none)

- [ ] **Step 1: Run the dev server**

Run: `npm run dev`
Expected: Vite dev server starts.

- [ ] **Step 2: Verify scroll behavior**

Open `http://localhost:5173/` in a browser and scroll through the whole page. Verify:

- At the hero, the MenuBar shows `@<username>:~`
- Scrolling into About shows `@<username>:~/about`
- Scrolling into the projects section header shows `@<username>:~/projects`
- Scrolling to each project card shows `@<username>:~/projects/atalaia-pro`, `~/projects/penhor`, `~/projects/bolso-bom`, `~/projects/musica-show`
- Scrolling into Expertise shows `@<username>:~/expertise`, and each capability card shows `~/expertise/api-backend`, `~/expertise/frontend-engineering`, `~/expertise/mobile`, `~/expertise/devops`, `~/expertise/ux-strategy`
- Scrolling into Education shows `@<username>:~/education`
- The path text fades in (slide-up + opacity) on each change
- No terminal title bars are sticky anymore
- The path truncates gracefully on narrow viewports instead of overflowing

- [ ] **Step 3: Final gate**

Run: `npm run build` and `npm run lint`
Expected: both pass.

---

## Self-Review

1. **Spec coverage** — Revert (Task 1), context/observer (Task 2), Layout wrap + MenuBar + animation (Task 3), all section and card registrations including the full path mapping table (Tasks 4-6), edge cases (hero registers `"~"` so it competes by ratio instead of being ignored; no-element → `null` → renders `~`). Manual E2E verification (Task 7).

2. **Placeholder scan** — All steps contain exact code. No TBDs.

3. **Type consistency** — `useActiveSection` returns `RefCallback<HTMLElement>` everywhere; `TerminalPanel` accepts `ref?: Ref<HTMLDivElement>`; `useActivePath` returns `string | null`. The `PROJECT_PATHS` record is keyed by the same `as const` array union used in `projectRefs`. No naming mismatches.
