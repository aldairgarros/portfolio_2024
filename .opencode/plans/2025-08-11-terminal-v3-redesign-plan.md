# Terminal Portfolio Redesign v3 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply a full terminal aesthetic — squared edges everywhere, terminal command output menu dropdown, grouped Projects section with menu sub-items, and `@...:~` prompt in the menubar.

**Architecture:** No routing changes. Projects grouped under one `<section id="projects">`; ProjectDetail loses its outer section but keeps an anchor div. FullScreenMenu deleted; dropdown lives inside MenuBar.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Framer Motion, react-i18next, Lucide React

## Global Constraints

- Use `@/` path alias for all internal imports
- No hardcoded user-facing strings in components (decorative glyphs `@...:~`, `>`, `█` are fine)
- TypeScript strict mode — no unused locals or parameters
- `React.JSX.Element` for explicit return types (React 19)
- `npm run build` must pass (typecheck + build); `npm run lint` must pass
- Final state: no `rounded-full`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl` on functional elements (Lightbox component and decorative scanlines exempt)
- No gradients in the final state (solid emerald only)

---

### Task 1: GlassCard + SectionTitle — square, no gradient, no glow

**Files:**
- Modify: `src/components/GlassCard/index.tsx`
- Modify: `src/components/SectionTitle/index.tsx`

**Interfaces:**
- Produces: unchanged `GlassCard({ children, hover, tilt, className, ...rest })`, unchanged `SectionTitle({ title, id, icon })`

- [ ] **Step 1: GlassCard** — change the `baseClasses` line to:

```tsx
  const baseClasses = `relative backdrop-blur-lg bg-white/10 dark:bg-white/5 rounded-none border border-zinc-200/30 dark:border-zinc-700/20 shadow-md p-6 ${
    hover ? "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" : ""
  } ${className}`;
```

- [ ] **Step 2: SectionTitle** — replace the underline div with a solid bar:

```tsx
      <div className="mt-3 h-1 w-16 bg-emerald-400" />
```

- [ ] **Step 3: Verify + commit**

```bash
npm run build
git add src/components/GlassCard/index.tsx src/components/SectionTitle/index.tsx
git commit -m "style: squared glass cards and solid emerald underlines"
```

---

### Task 2: MenuBar — terminal prompt, dropdown with nested items

**Files:**
- Rewrite: `src/modules/MenuBar/index.tsx`
- Delete: `src/modules/MenuBar/FullScreenMenu.tsx`
- Modify: `src/pages/Layout.tsx`

**Interfaces:**
- Consumes: `links: NavItem[]` where `NavItem = { label: string; hash: string; children?: NavItem[] }`
- Produces: unchanged `MenuBar({ links })`, unchanged `RootLayout`

- [ ] **Step 1: Rewrite `src/pages/Layout.tsx`** — nested structure

```tsx
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MenuBar } from "@/modules/MenuBar";
import { BackgroundDecoration } from "@/components/BackgroundDecoration";

interface NavItem {
  label: string;
  hash: string;
  children?: NavItem[];
}

export function RootLayout() {
  const { t } = useTranslation("translation");

  const links: NavItem[] = [
    { label: t("about.title"), hash: "about" },
    { label: t("expertise.title"), hash: "expertise" },
    {
      label: t("projects.title"),
      hash: "projects",
      children: (["atalaiaPro", "penhor", "bolsobom", "musicaShow"] as const).map((id) => ({
        label: t(`projects.list.${id}.name.value`),
        hash: id,
      })),
    },
    { label: t("education.title"), hash: "education" },
    { label: t("contact.title"), hash: "contact" },
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

- [ ] **Step 2: Rewrite `src/modules/MenuBar/index.tsx`** — complete file:

```tsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, ScrollRestoration } from "react-router-dom";

export interface NavItem {
  label: string;
  hash: string;
  children?: NavItem[];
}

interface Props {
  links: NavItem[];
}

export function MenuBar({ links }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { i18n, t } = useTranslation();
  const { language, changeLanguage } = i18n;

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    document.documentElement.lang = lang;
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
            className="flex items-center gap-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none rounded-none">
            <span className="font-mono text-sm font-semibold text-emerald-500 dark:text-emerald-400">
              @...:~
            </span>
            <span className="font-heading font-medium text-primary-900 dark:text-primary-50">
              {t("hero.title.value")}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex border border-primary-300 dark:border-primary-600 overflow-hidden">
              {(["en", "br"] as const).map((lang) => (
                <button
                  key={lang}
                  className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                    language === lang
                      ? "bg-emerald-500 text-white"
                      : "text-primary-600 dark:text-primary-400 hover:text-emerald-500 dark:hover:text-emerald-400"
                  }`}
                  onClick={() => handleLanguageChange(lang)}
                  aria-label={t(lang === "en" ? "home.langEn" : "home.langBr")}
                  aria-pressed={language === lang}>
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="relative">
              <button
                className="flex items-center gap-1 px-3 py-1.5 border border-emerald-400/40 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors font-mono text-sm cursor-pointer select-none focus:ring-2 focus:ring-emerald-400 focus:outline-none rounded-none"
                onClick={() => setIsMenuOpen((state) => !state)}
                aria-label={isMenuOpen ? t("home.menuClose") : t("home.menuOpen")}
                aria-expanded={isMenuOpen}>
                <span>@...:~</span>
                <span className={isMenuOpen ? "" : "animate-pulse"}>█</span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 z-40 backdrop-blur-lg bg-white/95 dark:bg-primary-900/95 border border-zinc-200/30 dark:border-zinc-700/20 shadow-lg">
                  <ul className="py-2">
                    {links.map((item) => (
                      <li key={item.hash}>
                        <Link
                          to={{ pathname: "/", hash: item.hash }}
                          className="flex items-center gap-2 px-4 py-2 font-mono text-sm text-primary-700 dark:text-primary-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                          onClick={() => setIsMenuOpen(false)}>
                          <span className="text-emerald-500">&gt;</span>
                          {item.label}
                        </Link>
                        {item.children && (
                          <ul>
                            {item.children.map((child) => (
                              <li key={child.hash}>
                                <Link
                                  to={{ pathname: "/", hash: child.hash }}
                                  className="flex items-center gap-2 pl-10 pr-4 py-1.5 font-mono text-sm text-primary-600 dark:text-primary-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                  onClick={() => setIsMenuOpen(false)}>
                                  <span className="text-emerald-500/70">&gt;</span>
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-zinc-200/30 dark:border-zinc-700/20 px-4 py-3">
                    <div className="flex gap-2">
                      {(["en", "br"] as const).map((lang) => (
                        <button
                          key={lang}
                          className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                            language === lang
                              ? "bg-emerald-500 text-white"
                              : "border border-primary-300 dark:border-primary-600 text-primary-600 dark:text-primary-400"
                          }`}
                          onClick={() => handleLanguageChange(lang)}
                          aria-label={t(lang === "en" ? "home.langEn" : "home.langBr")}>
                          {lang.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
```

Note: the `useEffect` for html lang from the v2 fix is replaced by an inline write in `handleLanguageChange`. If lint flags `react-hooks/immutability` for `document.documentElement.lang`, restore the `useEffect` pattern:

```tsx
import { useEffect, useState } from "react";
// in component body:
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
```

and remove the write from `handleLanguageChange`.

- [ ] **Step 3: Delete FullScreenMenu.tsx**

```bash
rm src/modules/MenuBar/FullScreenMenu.tsx
```

- [ ] **Step 4: Verify + commit**

```bash
npm run build && npm run lint
git add src/modules/MenuBar/index.tsx src/pages/Layout.tsx
git rm src/modules/MenuBar/FullScreenMenu.tsx
git commit -m "refactor: terminal dropdown menu with nested project items"
```

---

### Task 3: Home + ProjectDetail — grouped projects

**Files:**
- Modify: `src/pages/home/index.tsx`
- Modify: `src/modules/Projects/ProjectDetail.tsx`

**Interfaces:**
- Produces: `ProjectDetail({ project, flip })` unchanged signature; home wraps them in a `#projects` section

- [ ] **Step 1: Rewrite `src/pages/home/index.tsx`**

```tsx
import { useTranslation } from "react-i18next";
import { About } from "@/modules/About";
import { Contact } from "@/modules/Contact";
import { Education } from "@/modules/Education";
import { Expertise } from "@/modules/Expertise";
import { Hero } from "@/modules/Hero";
import { ProjectDetail } from "@/modules/Projects/ProjectDetail";
import { SectionTitle } from "@/components/SectionTitle";

const PROJECTS = ["atalaiaPro", "penhor", "bolsobom", "musicaShow"];

export function Home() {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <About />
      <Expertise />
      <section id="projects" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <SectionTitle title={t("title")} />
        <div className="flex flex-col gap-16">
          {PROJECTS.map((project, index) => (
            <ProjectDetail key={project} project={project} flip={index % 2 !== 0} />
          ))}
        </div>
      </section>
      <Education />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 2: Rewrite `src/modules/Projects/ProjectDetail.tsx`** — remove outer section, keep anchor div, square corners

Changes to the current file:
1. Change the outer element from `<section id={project} className="py-24 px-4 sm:px-8">` to `<div id={project}>` (the parent section handles padding)
2. Change the card div: `rounded-2xl` → `rounded-none`
3. Change main image: `rounded-xl` → `rounded-none`
4. Change thumbnails: `rounded-lg` → `rounded-none`
5. Change link button: `rounded-full` → `rounded-none`
6. Close with `</div>` instead of `</section>`

- [ ] **Step 3: Verify + commit**

```bash
npm run build
git add src/pages/home/index.tsx src/modules/Projects/ProjectDetail.tsx
git commit -m "refactor: group projects under a single section"
```

---

### Task 4: Hero + Contact — square corners

**Files:**
- Modify: `src/modules/Hero/index.tsx`
- Modify: `src/modules/Contact/index.tsx`

- [ ] **Step 1: Hero** — add `rounded-none` to both badge GlassCards' className (they inherit GlassCard's base which is already `rounded-none`, so no change strictly needed — verify only)

Verify GlassCard base now has `rounded-none`; badges inherit it. No change needed unless a rounded class was passed explicitly.

- [ ] **Step 2: Contact** — change link buttons:

`rounded-full` → `rounded-none` in the contact link className. The message GlassCard inherits square corners automatically.

- [ ] **Step 3: Verify + commit**

```bash
npm run build
git add src/modules/Hero/index.tsx src/modules/Contact/index.tsx
git commit -m "style: square corners in hero badges and contact links"
```

---

### Task 5: Final verification — squared everywhere, no gradients

- [ ] **Step 1: Grep for rounded/gradient leftovers**

```bash
rg -n "rounded-(full|lg|xl|2xl|3xl)|bg-gradient|from-emerald|to-emerald|via-" src/ --glob '*.tsx' --glob '*.css'
```

Expected: only matches in `src/components/Lightbox/index.tsx` (exempt) or none. If found elsewhere, fix.

- [ ] **Step 2: Build + lint**

```bash
npm run build && npm run lint
```

Expected: both pass.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "chore: terminal square-edge final verification" || echo "nothing to commit"
```
