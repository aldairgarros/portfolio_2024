# Portfolio Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the portfolio from code-as-UI bracket aesthetic to glassmorphism design, fix 5 bugs, remove dead code, add Education section.

**Architecture:** Replace Container/Section with GlassCard/SectionTitle components. Simplify routing to `/` (single-page scroll) and `/projects/:project` (detail). Redesign all modules with glassmorphism cards, Inter font, and subtle hover animations.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Vite 8, react-router-dom v7, i18next, Inter (Google Fonts).

## Global Constraints

- All user-facing text must live in locale JSON files (en.json, br.json) — no hardcoded strings in components
- Path alias `@/` resolves to `src/` — always use `@/` for internal imports
- Section anchor IDs are fixed English: `hero`, `education`, `projects`, `expertise`, `about`, `contact`
- External links (mailto, tel, https://wa.me, linkedin.com, github.com) use `<a>` with `target="_blank"` and `rel="noopener noreferrer"`
- Internal links (hash-based navigation, /projects/:project) use react-router `<Link>`
- Glass card pattern: `backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl shadow-xl`
- Card hover: `hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300`
- Focus style on all interactive elements: `focus:ring-2 focus:ring-secondary-500 focus:outline-none`

---

### Task 1: Foundation — GlassCard, SectionTitle, globals.css, index.html, i18n

**Files:**

- Create: `src/components/GlassCard/index.tsx`
- Create: `src/components/SectionTitle/index.tsx`
- Modify: `src/globals.css:3-92`
- Modify: `index.html:1-13`
- Modify: `src/i18n.ts:17`

**Interfaces:**

- Produces: `GlassCard` — accepts `children: React.ReactNode`, optional `className?: string`, optional `hover?: boolean`; renders a glass card div
- Produces: `SectionTitle` — accepts `title: string`, optional `id?: string`; renders an h2 with gradient underline and id

- [ ] **Step 1: Create GlassCard component**

Write `src/components/GlassCard/index.tsx`:

```tsx
import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function GlassCard({ children, hover = false, className = "", ...rest }: Props) {
  return (
    <div
      className={`backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl shadow-xl p-6 ${
        hover ? "hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300" : ""
      } ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create SectionTitle component**

Write `src/components/SectionTitle/index.tsx`:

```tsx
interface Props {
  title: string;
  id?: string;
}

export function SectionTitle({ title, id }: Props) {
  return (
    <div className="mb-12">
      <h2 id={id} className="text-3xl sm:text-4xl font-bold text-primary-900 dark:text-primary-50">
        {title}
      </h2>
      <div className="mt-3 h-1 w-16 bg-gradient-to-r from-secondary-500 to-secondary-400 rounded-full" />
    </div>
  );
}
```

- [ ] **Step 3: Update globals.css — remove unused color aliases, add Inter font, fix section padding**

Replace `src/globals.css` entirely:

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

- [ ] **Step 4: Add Inter font to index.html**

Replace `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="Aldair Garros — Fullstack Developer & Software Engineering Specialist. Portfolio showcasing web and mobile development projects."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <title>Aldair Garros — Developer & Software Engineering Specialist</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Fix i18n debug mode**

In `src/i18n.ts:17`, change:

```
debug: true,
```

to:

```
debug: import.meta.env.DEV,
```

- [ ] **Step 6: Verify Foundation builds**

Run: `npm run build`
Expected: Clean build with no errors. The new components exist but aren't yet imported, so no functional change.

- [ ] **Step 7: Commit**

```bash
git add src/components/GlassCard/index.tsx src/components/SectionTitle/index.tsx src/globals.css index.html src/i18n.ts
git commit -m "feat: add GlassCard, SectionTitle, Inter font, fix i18n debug mode"
```

---

### Task 2: Locale files — fix accents, add Education, remove dead keys, fix contact for external links

**Files:**

- Modify: `src/locales/en.json:1-471`
- Modify: `src/locales/br.json:1-471`

**Interfaces:**

- Consumes: Locale files must match the structures consumed by upcoming module tasks
- Produces: Fixed Portuguese accents, new `education` section, removed `extra.openToWork`, external link URLs with `isExternal` flags

- [ ] **Step 1: Fix Portuguese accents in br.json**

Use `edit` tool to fix all accent issues:

- `"visao geral"` → `"visão geral"`
- `"descriçao"` → `"descrição"`
- `"detalhes"` → `"detalhes"` (already ok)
- `"previsao"` → `"previsão"`
- `"previsoes"` → `"previsões"`
- `"atualizaçoes"` → `"atualizações"`
- `"comunicaçao"` → `"comunicação"`
- `"importaçao"` → `"importação"`
- `"instalaçao"` → `"instalação"`
- `"reduçao"` → `"redução"`
- `"operaçao"` → `"operação"`
- `"geraçao"` → `"geração"`
- `"práticos"` and `"praticos"` → `"práticos"` (consistent)

- [ ] **Step 2: Add Education section to en.json**

After the hero section and before the projects section, insert:

```json
  "education": {
    "title": "Education",
    "course": {
      "title": "Software Engineering Specialist",
      "institution": "USP/ESALQ",
      "period": "2024 — 2026",
      "description": "Postgraduate specialization in Software Engineering at the University of Sao Paulo (USP/ESALQ). The program covered software architecture, design patterns, agile methodologies, project management, and culminated in a Design Thinking capstone project: Atalaia Pro — a real-time SPA/PWA system developed for the Atalaia port authority that reduced maritime maneuver report preparation time by 82%."
    }
  },
```

- [ ] **Step 3: Add Education section to br.json**

After the hero section and before the projects section, insert:

```json
  "education": {
    "title": "Formação",
    "course": {
      "title": "Especialista em Engenharia de Software",
      "institution": "USP/ESALQ",
      "period": "2024 — 2026",
      "description": "Especialização de pós-graduação em Engenharia de Software pela Universidade de São Paulo (USP/ESALQ). O programa abordou arquitetura de software, padrões de projeto, metodologias ágeis, gerenciamento de projetos e culminou em um projeto de conclusão baseado em Design Thinking: Atalaia Pro — um sistema SPA/PWA em tempo real desenvolvido para a autoridade portuária da Atalaia que reduziu o tempo de preparação de relatórios de manobra em 82%."
    }
  },
```

- [ ] **Step 4: Remove `extra.openToWork` from both locale files**

In both `en.json` and `br.json`, remove the line `"openToWork": ...` from the `extra` section. The `extra` section should now only contain `imOpenToNewOpportunities`.

- [ ] **Step 5: Fix contact links — add `isExternal` flag to en.json contact entries**

For LinkedIn and GitHub entries (which are external URLs), add `"isExternal": true`:

```json
"linkedIn": {
  "label": "linkedIn",
  "value": "aldairgc",
  "href": "https://www.linkedin.com/in/aldairgc/",
  "isExternal": true
},
"github": {
  "label": "github",
  "value": "aldair-gc",
  "href": "https://github.com/aldair-gc",
  "isExternal": true
}
```

For WhatsApp, add `"isExternal": true`:

```json
"whatsApp": {
  "label": "whatsApp",
  "value": "5598988692991",
  "href": "https://wa.me/5598988692991/",
  "isExternal": true
}
```

Email and phone have `mailto:` and `tel:` protocols — these already work with `<a>` tags, no `isExternal` needed (they don't open new tabs).

- [ ] **Step 6: Apply same `isExternal` flags to br.json contact entries**

Mirror the exact same `"isExternal": true` additions for linkedIn, github, and whatsApp in `br.json`.

- [ ] **Step 7: Verify locale JSON is valid**

Run: `node -e "JSON.parse(require('fs').readFileSync('src/locales/en.json','utf8')); JSON.parse(require('fs').readFileSync('src/locales/br.json','utf8')); console.log('Both valid')"`
Expected: `Both valid`

- [ ] **Step 8: Commit**

```bash
git add src/locales/en.json src/locales/br.json
git commit -m "fix: correct Portuguese accents, add Education section, add isExternal flags to contact links"
```

---

### Task 3: Router simplification + dead code cleanup + Layout fix

**Files:**

- Modify: `src/router.tsx:1-20`
- Modify: `src/pages/Layout.tsx:1-25`
- Delete: `src/components/Container/index.tsx`
- Delete: `src/components/Section/index.tsx`
- Delete: `src/components/LinkButton/index.tsx`
- Delete: `src/components/TextBox/index.tsx`
- Delete: `src/components/Attribute/Link.tsx`
- Delete: `src/components/Attribute/Images.tsx`
- Delete: `src/components/Attribute/index.tsx`
- Delete: `src/interfaces/attribute-interface.tsx`
- Delete: `src/interfaces/image-interface.tsx`
- Delete: `src/interfaces/item-interface.tsx`
- Delete: `src/interfaces/skill-interface.tsx`
- Delete: `src/pages/about/index.tsx`
- Delete: `src/pages/projects/index.tsx`

- [ ] **Step 1: Simplify router.tsx**

Replace `src/router.tsx`:

```tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "./pages/Layout";
import { Home } from "./pages/home";
import { Project } from "./pages/project";

export default function AppRouter() {
  const root = createBrowserRouter([
    {
      element: <RootLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/projects/:project", element: <Project /> },
      ],
    },
  ]);

  return <RouterProvider router={root} />;
}
```

- [ ] **Step 2: Update Layout.tsx — fix gradient to use primary alias, pass fixed English links**

Replace `src/pages/Layout.tsx`:

```tsx
import { Outlet } from "react-router-dom";
import { MenuBar } from "@/modules/MenuBar";

export function RootLayout() {
  const LINKS = [
    { label: "Home", hash: "hero" },
    { label: "Education", hash: "education" },
    { label: "Projects", hash: "projects" },
    { label: "Expertise", hash: "expertise" },
    { label: "About", hash: "about" },
    { label: "Contact", hash: "contact" },
  ];

  return (
    <div className="flex items-center justify-center">
      <MenuBar links={LINKS} />
      <Outlet />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
      >
        <div
          style={{
            clipPath: "polygon(0% 70%, 20% 20%, 0% 0%, 30% 100%, 100% 10%, 20% 50%, 100% 50%)",
          }}
          className="relative aspect-square h-full left-1/2 -translate-x-1/2 bg-gradient-to-tr from-primary-600 to-primary-100 opacity-20 dark:from-primary-800 dark:to-primary-950"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Delete all dead files**

Run:

```bash
rm src/components/Container/index.tsx
rm src/components/Section/index.tsx
rm src/components/LinkButton/index.tsx
rm src/components/TextBox/index.tsx
rm src/components/Attribute/Link.tsx
rm src/components/Attribute/Images.tsx
rm src/components/Attribute/index.tsx
rm src/interfaces/attribute-interface.tsx
rm src/interfaces/image-interface.tsx
rm src/interfaces/item-interface.tsx
rm src/interfaces/skill-interface.tsx
rm src/pages/about/index.tsx
rm src/pages/projects/index.tsx
```

- [ ] **Step 4: Build to verify no import errors**

Run: `npm run build`
Expected: This WILL fail because the remaining modules still import the deleted components (`Container`, `Section`, `Attribute`, etc.). This is expected — we're removing old code that will be replaced in subsequent tasks.
Expected output: Build will show TypeScript errors about missing imports from `@/components/Container`, `@/components/Section`, etc. This is acceptable as the next tasks will fix all of these.

- [ ] **Step 5: Commit**

```bash
git add src/router.tsx src/pages/Layout.tsx
git rm src/components/Container/index.tsx src/components/Section/index.tsx src/components/LinkButton/index.tsx src/components/TextBox/index.tsx src/components/Attribute/Link.tsx src/components/Attribute/Images.tsx src/components/Attribute/index.tsx src/interfaces/attribute-interface.tsx src/interfaces/image-interface.tsx src/interfaces/item-interface.tsx src/interfaces/skill-interface.tsx src/pages/about/index.tsx src/pages/projects/index.tsx
git commit -m "refactor: simplify router, remove dead code, update Layout gradient"
```

---

### Task 4: MenuBar redesign — pill language switcher, fix mobile bug, fixed hash IDs

**Files:**

- Modify: `src/modules/MenuBar/index.tsx:1-59`
- Modify: `src/modules/MenuBar/FullScreenMenu.tsx:1-60`

**Interfaces:**

- Consumes: `links` prop from Layout — array of `{ label: string, hash: string }`
- Produces: Working language switcher on both mobile and desktop, hash nav using fixed English IDs

- [ ] **Step 1: Redesign MenuBar**

Replace `src/modules/MenuBar/index.tsx`:

```tsx
import { useState } from "react";
import { FullScreenMenu } from "./FullScreenMenu";
import { Link, ScrollRestoration } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
        className="fixed top-0 flex justify-end w-full backdrop-blur-md bg-white/70 dark:bg-primary-900/70 z-20"
        role="navigation"
        aria-label="Main navigation"
      >
        <button
          className="sm:hidden flex items-center justify-center w-12 h-12 cursor-pointer select-none focus:ring-2 focus:ring-secondary-500 focus:outline-none"
          onClick={() => setIsMenuOpen((state) => !state)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <span className="text-xl font-bold text-primary-900 dark:text-primary-50">
            {isMenuOpen ? "✕" : "☰"}
          </span>
        </button>
        <div className="hidden sm:flex w-full max-w-6xl h-12 mx-auto items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className="text-lg font-bold text-primary-900 dark:text-primary-50 mr-6 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors focus:ring-2 focus:ring-secondary-500 focus:outline-none rounded"
            >
              AG
            </Link>
            {links.map((link) => (
              <Link
                key={link.hash}
                className="px-3 py-1 text-sm font-medium text-primary-700 dark:text-primary-300 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors rounded focus:ring-2 focus:ring-secondary-500 focus:outline-none"
                to={{ pathname: "/", hash: link.hash }}
              >
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
                aria-pressed={language === "en"}
              >
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
                aria-pressed={language === "br"}
              >
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

- [ ] **Step 2: Redesign FullScreenMenu — fix mobile language switcher**

Replace `src/modules/MenuBar/FullScreenMenu.tsx`:

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
      className={`fixed inset-0 top-12 bg-white/95 dark:bg-primary-900/95 backdrop-blur-md z-30 overscroll-contain overflow-hidden transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      {...rest}
    >
      <div className="flex flex-col gap-6 w-full h-full p-8 pt-12">
        <div className="flex flex-col gap-2">
          {links.map((link, ind) => (
            <Link
              key={link.hash}
              className={`text-2xl font-medium text-primary-900 dark:text-primary-50 hover:text-secondary-600 dark:hover:text-secondary-400 transition-all duration-300 cursor-pointer focus:ring-2 focus:ring-secondary-500 focus:outline-none rounded ${
                open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: `${ind * 50}ms` }}
              to={{ pathname: "/", hash: link.hash }}
            >
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
              aria-label={lang === "en" ? "Switch to English" : "Mudar para português"}
            >
              {lang === "en" ? "English" : "Português"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build — expected to still fail from Task 3's old imports**

Run: `npm run build`
Expected: The MenuBar builds fine, but other modules still import deleted components. Expected partial failure.

- [ ] **Step 4: Commit**

```bash
git add src/modules/MenuBar/index.tsx src/modules/MenuBar/FullScreenMenu.tsx
git commit -m "refactor: redesign MenuBar with pill language switcher, fix mobile i18n, fixed hash IDs"
```

---

### Task 5: Hero redesign + Education section

**Files:**

- Modify: `src/modules/Hero/index.tsx:1-36`
- Create: `src/modules/Education/index.tsx`
- Modify: `src/pages/home/index.tsx:1-24`

**Interfaces:**

- Consumes: `GlassCard`, `SectionTitle` from Task 1; new `education` locale keys from Task 2
- Produces: Redesigned Hero with glass badge, new Education module

- [ ] **Step 1: Redesign Hero**

Replace `src/modules/Hero/index.tsx`:

```tsx
import { useTranslation } from "react-i18next";
import { GlassCard } from "@/components/GlassCard";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center max-h-[1024px] h-screen px-4 text-center"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-500/10 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-sm sm:text-base font-medium text-secondary-600 dark:text-secondary-400 mb-4 tracking-widest uppercase">
            {t("hero.title.label")}
          </p>
          <h1 className="text-5xl sm:text-7xl font-bold text-primary-900 dark:text-primary-50 mb-6">
            {t("hero.title.value")}
          </h1>
          <p className="text-lg sm:text-xl text-primary-600 dark:text-primary-400 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle.value")}
          </p>
          <div className="mt-8 flex justify-center">
            <GlassCard className="inline-flex items-center gap-2 px-5 py-2 border-secondary-500/30">
              <span className="text-secondary-600 dark:text-secondary-400 text-sm font-semibold">
                USP/ESALQ &middot; 2026
              </span>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create Education module**

Write `src/modules/Education/index.tsx`:

```tsx
import { useTranslation } from "react-i18next";
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";

export function Education() {
  const { t } = useTranslation("translation", { keyPrefix: "education" });

  return (
    <section id="education" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <GlassCard hover className="max-w-2xl">
        <div className="flex items-start gap-4">
          <span className="text-3xl">&#x1F393;</span>
          <div>
            <h3 className="text-xl font-semibold text-primary-900 dark:text-primary-50">
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
    </section>
  );
}
```

- [ ] **Step 3: Update Home page to include Education**

Replace `src/pages/home/index.tsx`:

```tsx
import { Hero } from "@/modules/Hero";
import { Education } from "@/modules/Education";
import { Projects } from "@/modules/Projects";
import { Expertise } from "@/modules/Expertise";
import { About } from "@/modules/About";
import { Contact } from "@/modules/Contact";
import { Sticker } from "@/modules/Sticker";

export function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Education />
      <Projects />
      <Expertise />
      <About />
      <Contact />
      <Sticker />
    </main>
  );
}
```

- [ ] **Step 4: Build — still expected to fail on Projects/Expertise/About/Contact/Sticker**

Run: `npm run build`
Expected: Hero and Education build fine. Other modules still have old imports. Expected partial failure.

- [ ] **Step 5: Commit**

```bash
git add src/modules/Hero/index.tsx src/modules/Education/index.tsx src/pages/home/index.tsx
git commit -m "feat: redesign Hero with glass badge, add Education section"
```

---

### Task 6: Projects module + ProjectCard + ProjectList redesign

**Files:**

- Modify: `src/modules/Projects/index.tsx:1-48`
- Modify: `src/modules/Projects/ProjectCard.tsx:1-29`
- Modify: `src/modules/Projects/ProjectList.tsx:1-28`

**Interfaces:**

- Consumes: `GlassCard`, `SectionTitle` from Task 1; `projects` locale keys from locale files
- Produces: Redesigned project grid, cards, and list

- [ ] **Step 1: Redesign ProjectCard**

Replace `src/modules/Projects/ProjectCard.tsx`:

```tsx
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";

interface ProjectProps extends React.HTMLAttributes<HTMLDivElement> {
  project: string;
}

export function ProjectCard({ project, ...rest }: ProjectProps) {
  const { t } = useTranslation("translation", { keyPrefix: `projects.list.${project}` });

  return (
    <GlassCard hover className="overflow-hidden p-0 group" {...rest}>
      <Link to={`/projects/${project}`} className="flex flex-col h-full">
        <div className="relative overflow-hidden bg-primary-100 dark:bg-primary-800">
          <img
            src={t("image.src")}
            alt={t("image.alt")}
            width={600}
            height={400}
            className="w-full h-64 object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-50">
              {t("name.value")}
            </h3>
            <span className="text-sm text-primary-500 dark:text-primary-400">
              {t("date.value")}
            </span>
          </div>
          <p className="text-sm text-primary-600 dark:text-primary-400 line-clamp-3">
            {t("overview.value")}
          </p>
          <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-secondary-600 dark:text-secondary-400 group-hover:gap-2 transition-all">
            {t("open")}
            <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </Link>
    </GlassCard>
  );
}
```

- [ ] **Step 2: Redesign Projects index (home page version)**

Replace `src/modules/Projects/index.tsx`:

```tsx
import { SectionTitle } from "@/components/SectionTitle";
import { ProjectCard } from "./ProjectCard";
import { useTranslation } from "react-i18next";

export function Projects() {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });
  const projects = ["penhor", "musicaShow", "bolsobom", "atalaiaPro"];
  const openLabel = t("open");

  return (
    <section id="projects" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project} project={project} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Redesign ProjectList**

Replace `src/modules/Projects/ProjectList.tsx`:

```tsx
import { SectionTitle } from "@/components/SectionTitle";
import { ProjectCard } from "./ProjectCard";
import { useTranslation } from "react-i18next";

interface Props {
  list: string[];
}

export function ProjectList({ list }: Props) {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });

  if (list.length === 0) return null;

  return (
    <section className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {list.map((project) => (
          <ProjectCard key={project} project={project} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Build — Projects compiles, remaining modules still broken**

Run: `npm run build`
Expected: Projects module compiles. Expertise, About, Contact, Sticker still reference deleted components.

- [ ] **Step 5: Commit**

```bash
git add src/modules/Projects/index.tsx src/modules/Projects/ProjectCard.tsx src/modules/Projects/ProjectList.tsx
git commit -m "refactor: redesign Projects, ProjectCard, ProjectList with glass cards"
```

---

### Task 7: Project detail page — fix image limit, external links, back link

**Files:**

- Modify: `src/pages/project/index.tsx:1-53`

**Interfaces:**

- Consumes: `GlassCard`, `SectionTitle` from Task 1; `ProjectList` from Task 6; locale keys with `isExternal` flags
- Produces: Proper project detail with all images, working external links, back-to-home link

- [ ] **Step 1: Rewrite project detail page**

Replace `src/pages/project/index.tsx`:

```tsx
import { ScrollRestoration, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Contact } from "@/modules/Contact";
import { GlassCard } from "@/components/GlassCard";
import { SectionTitle } from "@/components/SectionTitle";
import { ProjectList } from "@/modules/Projects/ProjectList";

interface ImageData {
  src: string;
  alt: string;
  width: string;
  height: string;
}

export function Project() {
  const { project } = useParams();
  const PROJECTLIST = ["penhor", "musicaShow", "bolsobom", "atalaiaPro"];

  const { t: p } = useTranslation("translation", { keyPrefix: `projects.list.${project}` });
  const { t: tProjects } = useTranslation("translation", { keyPrefix: "projects" });

  const imageKeys = Object.keys(
    (p("images.list", { returnObjects: true }) as Record<string, unknown>) || {},
  ).filter((k) => k.startsWith("image"));

  const images: ImageData[] = imageKeys.map((key: string) => ({
    src: p(`images.list.${key}.src`),
    alt: p(`images.list.${key}.alt`),
    width: p(`images.list.${key}.width`),
    height: p(`images.list.${key}.height`),
  }));

  const linkHref = p("link.href");
  const linkValue = p("link.value");

  return (
    <main className="flex min-h-screen flex-col pt-16">
      <ScrollRestoration />
      <div className="py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-1 text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 transition-colors mb-12 focus:ring-2 focus:ring-secondary-500 focus:outline-none rounded"
        >
          <span aria-hidden="true">&larr;</span>
          {tProjects("title")}
        </Link>

        <SectionTitle title={p("name.value")} />

        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary-500 dark:text-primary-400">
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
              className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-full border border-secondary-500/30 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-500 hover:text-white transition-colors font-medium text-sm focus:ring-2 focus:ring-secondary-500 focus:outline-none"
            >
              {linkValue || "Visit project"}
              <span aria-hidden="true">&nearr;</span>
            </a>
          )}

          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-primary-500 dark:text-primary-400 mb-4">
                {p("images.label")}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img, i) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    width={+img.width}
                    height={+img.height}
                    className="rounded-xl object-contain w-full h-auto"
                    loading="lazy"
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
    </main>
  );
}
```

- [ ] **Step 2: Verify project detail compiles**

Run: `npm run build`
Expected: Project detail compiles. Still expected to fail on Expertise, About, Contact, Sticker.

- [ ] **Step 3: Commit**

```bash
git add src/pages/project/index.tsx
git commit -m "fix: project detail — dynamic images, external links, back-to-home"
```

---

### Task 8: Expertise + Skill redesign, fix drop-shadow bug

**Files:**

- Modify: `src/modules/Expertise/index.tsx:1-39`
- Modify: `src/modules/Expertise/Skill.tsx:1-28`

**Interfaces:**

- Consumes: `GlassCard`, `SectionTitle` from Task 1; `expertise.json` and locale keys
- Produces: Redesigned expertise section with glass skill pills, no broken CSS

- [ ] **Step 1: Redesign Expertise**

Replace `src/modules/Expertise/index.tsx`:

```tsx
import { useTranslation } from "react-i18next";
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";
import { Skill } from "@/modules/Expertise/Skill";
import expertise from "@/assets/expertise.json";

export function Expertise() {
  const { t } = useTranslation("translation", { keyPrefix: "expertise" });

  return (
    <section id="expertise" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <div className="flex flex-col gap-12">
        {expertise.map((field) => (
          <div key={field.name}>
            <h3 className="text-lg font-semibold text-secondary-600 dark:text-secondary-400 mb-4">
              {t(`list.${field.name}.title`)}
            </h3>
            <GlassCard>
              <div className="flex flex-wrap gap-4">
                {field.values.map((value) => (
                  <Skill key={value} expertise={field.name} skill={value} />
                ))}
              </div>
            </GlassCard>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Redesign Skill — fix dark:drop-shadow-light bug**

Replace `src/modules/Expertise/Skill.tsx`:

```tsx
import { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

interface Props extends HTMLAttributes<HTMLDivElement> {
  expertise: string;
  skill: string;
}

export function Skill({ expertise, skill, ...rest }: Props) {
  const { t } = useTranslation("translation", { keyPrefix: "expertise" });

  return (
    <div
      className="flex flex-col items-center gap-2 p-3 rounded-xl backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 hover:scale-110 transition-transform cursor-default w-20"
      {...rest}
    >
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
    </div>
  );
}
```

- [ ] **Step 3: Build — Expertise compiles, About/Contact/Sticker still broken**

Run: `npm run build`
Expected: Expertise compiles. Only About, Contact, Sticker remain broken.

- [ ] **Step 4: Commit**

```bash
git add src/modules/Expertise/index.tsx src/modules/Expertise/Skill.tsx
git commit -m "refactor: redesign Expertise with glass cards, fix drop-shadow bug"
```

---

### Task 9: About, Contact, Sticker — fix bugs, complete redesign

**Files:**

- Modify: `src/modules/About/index.tsx:1-30`
- Modify: `src/modules/Contact/index.tsx:1-41`
- Modify: `src/modules/Sticker/index.tsx:1-21`

**Interfaces:**

- Consumes: `GlassCard`, `SectionTitle` from Task 1; contact locale keys with `isExternal` flags
- Produces: All modules working, all bugs fixed, glassmorphism throughout

- [ ] **Step 1: Redesign About**

Replace `src/modules/About/index.tsx`:

```tsx
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";
import { useTranslation } from "react-i18next";

export function About() {
  const { t } = useTranslation("translation", { keyPrefix: "about" });
  const LIST = ["experience1", "experience2"];

  return (
    <section id="about" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <div className="flex flex-col gap-8">
        {LIST.map((item) => (
          <GlassCard key={item} hover className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h3 className="text-xl font-semibold text-primary-900 dark:text-primary-50">
                {t(`list.${item}.title.value`)}
              </h3>
              <span className="text-sm text-primary-500 dark:text-primary-400 mt-1 sm:mt-0">
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
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Redesign Contact — fix external links**

Replace `src/modules/Contact/index.tsx`:

```tsx
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";
import { useTranslation } from "react-i18next";

export function Contact() {
  const { t } = useTranslation("translation", { keyPrefix: "contact" });
  const keys = ["email", "phone", "whatsApp", "linkedIn", "github"] as const;

  return (
    <section id="contact" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="flex items-center">
          <p className="text-primary-700 dark:text-primary-300 leading-relaxed">{t("message")}</p>
        </GlassCard>
        <GlassCard>
          <div className="flex flex-wrap gap-3">
            {keys.map((key) => {
              const href = t(`list.${key}.href`);
              const isExternal = t(`list.${key}.isExternal`, "") === "true";
              const value = t(`list.${key}.value`);

              if (isExternal) {
                return (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-full border border-primary-200 dark:border-primary-700 text-sm text-primary-700 dark:text-primary-300 hover:bg-secondary-500 hover:text-white hover:border-secondary-500 transition-colors focus:ring-2 focus:ring-secondary-500 focus:outline-none"
                  >
                    {value}
                  </a>
                );
              }

              return (
                <a
                  key={key}
                  href={href}
                  className="px-4 py-2 rounded-full border border-primary-200 dark:border-primary-700 text-sm text-primary-700 dark:text-primary-300 hover:bg-secondary-500 hover:text-white hover:border-secondary-500 transition-colors focus:ring-2 focus:ring-secondary-500 focus:outline-none"
                >
                  {value}
                </a>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
```

Note: The Contact module currently accepts a `textBox` prop from the home page. Since we're removing the TextBox component, we need to add a `message` key to the contact locale section. We also need to handle the `isExternal` flag from locale data as a string (since it's a locale value).

Actually, looking more carefully at the locale structure, `isExternal` as a locale key is awkward. Let me simplify: we know which keys are external (whatsApp, linkedIn, github) — we hardcode that list instead of reading from locale.

Let me also add the `message` key to both locale files. The message should be the same as `imOpenToNewOpportunities` from `extra`. Let me add that in this task.

- [ ] **Step 3: Add `message` key to contact section in both locale files**

In `en.json`, under `contact`, add before `list`:

```json
"message": "I'm open to new opportunities, so feel free to contact me.",
```

In `br.json`, under `contact`, add before `list`:

```json
"message": "Estou disponível para novas oportunidades. Entre em contato comigo.",
```

And remove the `extra` section entirely from both files (only `imOpenToNewOpportunities` remained).

Now replace Contact with the correct version that hardcodes external keys:

Replace `src/modules/Contact/index.tsx`:

```tsx
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";
import { useTranslation } from "react-i18next";

const EXTERNAL_KEYS = ["whatsApp", "linkedIn", "github"];

export function Contact() {
  const { t } = useTranslation("translation", { keyPrefix: "contact" });
  const keys = ["email", "phone", "whatsApp", "linkedIn", "github"] as const;

  return (
    <section id="contact" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

            const extraProps = isExternal
              ? { target: "_blank", rel: "noopener noreferrer" as const }
              : {};

            return (
              <a
                key={key}
                href={href}
                {...extraProps}
                className="px-4 py-3 rounded-full border border-primary-200 dark:border-primary-700 text-sm text-primary-700 dark:text-primary-300 hover:bg-secondary-500 hover:text-white hover:border-secondary-500 transition-colors focus:ring-2 focus:ring-secondary-500 focus:outline-none"
              >
                {value}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Redesign Sticker**

Replace `src/modules/Sticker/index.tsx`:

```tsx
import { GlassCard } from "@/components/GlassCard";
import { useTranslation } from "react-i18next";

export function Sticker() {
  const { t } = useTranslation();

  return (
    <div className="fixed hidden lg:block bottom-8 left-8 z-10">
      <GlassCard className="px-4 py-2 text-sm">
        <a
          href={`mailto:${t("contact.list.email.value")}`}
          className="text-primary-700 dark:text-primary-300 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors focus:ring-2 focus:ring-secondary-500 focus:outline-none rounded"
        >
          {t("contact.list.email.value")}
        </a>
      </GlassCard>
    </div>
  );
}
```

- [ ] **Step 5: Remove `isExternal` from locale files (we hardcoded it)**

We no longer need `isExternal` in locale files since Contact hardcodes the external key list. Also remove the `extra` section entirely from both locale files since the message moved to `contact.message`.

In both `en.json` and `br.json`, remove the `extra` section and the `isExternal` flags added in Task 2. Also remove `isExternal` from contact entries — we hardcode the external list in the component.

- [ ] **Step 6: Build — should now compile clean**

Run: `npm run build`
Expected: Clean build, no errors.

- [ ] **Step 7: Commit**

```bash
git add src/modules/About/index.tsx src/modules/Contact/index.tsx src/modules/Sticker/index.tsx src/locales/en.json src/locales/br.json
git commit -m "refactor: redesign About, Contact, Sticker with glass cards, fix external links"
```

---

### Task 10: Final verification and cleanup

**Files:**

- Verify: All files

- [ ] **Step 1: Run full build**

Run: `npm run build`
Expected: TypeScript typecheck passes, Vite builds successfully. Zero errors.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: Zero lint errors. If any remain (unused imports, etc.), fix them.

- [ ] **Step 3: Check for any remaining dead imports or unused files**

Run: `npx tsc --noEmit 2>&1 | head -50`
Expected: No errors.

- [ ] **Step 4: Review git status for any untracked files that should be tracked**

Run: `git status`

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "chore: final verification, cleanup remaining issues"
```

Expected final state: All tasks committed, build passing, lint passing.
