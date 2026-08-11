# Full Terminal Portfolio v4 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Push the portfolio fully into a terminal aesthetic: monospace everywhere, backtick-wrapped titles, CSS terminal-frame borders, visible hero cubes, `@Aldair Garros:~` prompt with `>_` button, and a fixed one-line contact footer.

**Architecture:** No routing changes. Contact becomes a fixed footer rendered in Layout. Typography becomes fully monospace.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Framer Motion, react-i18next, Lucide React

## Global Constraints

- Use `@/` path alias for all internal imports
- No hardcoded user-facing strings in components (decorative glyphs `@`, `:~`, `>_`, `█`, `` ` ``, `|` are fine)
- TypeScript strict mode — no unused locals or parameters
- `React.JSX.Element` for explicit return types (React 19)
- `npm run build` must pass; `npm run lint` must pass
- No `font-heading` or `font-sans` usage in any component (full monospace)
- No `rounded-*` or gradient classes anywhere
- Terminal frame border style: `border border-zinc-200/30 dark:border-zinc-700/20 border-t-2 border-t-zinc-400/50 dark:border-t-zinc-600/50`

---

### Task 1: globals.css — full monospace root font

**Files:**
- Modify: `src/globals.css`

- [ ] **Step 1: Change root font-family** (line 101)

```css
:root {
  font-family: "JetBrains Mono", ui-monospace, monospace;
```

- [ ] **Step 2: Verify + commit**

```bash
npm run build
git add src/globals.css
git commit -m "style: monospace root font"
```

---

### Task 2: SectionTitle — backtick-wrapped markdown titles

**Files:**
- Modify: `src/components/SectionTitle/index.tsx`

- [ ] **Step 1: Rewrite the component** — complete file:

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
        className="text-4xl sm:text-5xl font-bold font-mono text-primary-900 dark:text-primary-50 flex items-center gap-3">
        {Icon && <Icon size={28} className="text-emerald-400 shrink-0" />}
        <span className="text-emerald-400">`</span>
        <span>{title}</span>
        <span className="text-emerald-400">`</span>
      </h2>
      <div className="mt-3 h-1 w-16 bg-emerald-400" />
    </div>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npm run build
git add src/components/SectionTitle/index.tsx
git commit -m "style: backtick-wrapped markdown section titles"
```

---

### Task 3: GlassCard + ProjectDetail card — terminal frame border

**Files:**
- Modify: `src/components/GlassCard/index.tsx`
- Modify: `src/modules/Projects/ProjectDetail.tsx`

- [ ] **Step 1: GlassCard baseClasses** — replace with terminal frame border:

```tsx
  const baseClasses = `relative backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-zinc-200/30 dark:border-zinc-700/20 border-t-2 border-t-zinc-400/50 dark:border-t-zinc-600/50 shadow-md p-6 ${
    hover ? "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" : ""
  } ${className}`;
```

- [ ] **Step 2: ProjectDetail card div** — change the card container (currently `rounded-none backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-zinc-200/30 dark:border-zinc-700/20 shadow-md overflow-hidden`) to:

```tsx
<div className="backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-zinc-200/30 dark:border-zinc-700/20 border-t-2 border-t-zinc-400/50 dark:border-t-zinc-600/50 shadow-md overflow-hidden">
```

- [ ] **Step 3: Verify + commit**

```bash
npm run build
git add src/components/GlassCard/index.tsx src/modules/Projects/ProjectDetail.tsx
git commit -m "style: terminal frame borders on containers"
```

---

### Task 4: Hero — visible robust cubes

**Files:**
- Modify: `src/modules/Hero/index.tsx`

- [ ] **Step 1: Cube face styling** (lines 43-44):

Change:
```tsx
            border: "1px solid rgb(16 185 129 / 0.4)",
            background: "rgb(16 185 129 / 0.04)",
```
To:
```tsx
            border: "1px solid rgb(16 185 129 / 0.55)",
            background: "rgb(16 185 129 / 0.08)",
```

- [ ] **Step 2: Cube containers** — change sizes and opacity. Current:

```tsx
        <div className="absolute top-1/2 left-[12%] -translate-y-1/2 opacity-20 blur-[1px] hidden sm:block">
          <Cube size={80} speedX={0} speedY={45} />
        </div>
        <div className="absolute top-1/2 right-[12%] -translate-y-1/2 opacity-20 blur-[1px] hidden sm:block">
          <Cube size={110} speedX={35} speedY={55} />
        </div>
```

Change to:

```tsx
        <div className="absolute top-1/2 left-[12%] -translate-y-1/2 opacity-40 hidden sm:block">
          <Cube size={140} speedX={0} speedY={45} />
        </div>
        <div className="absolute top-1/2 right-[12%] -translate-y-1/2 opacity-40 hidden sm:block">
          <Cube size={180} speedX={35} speedY={55} />
        </div>
```

- [ ] **Step 3: Verify + commit**

```bash
npm run build
git add src/modules/Hero/index.tsx
git commit -m "style: more visible hero cubes"
```

---

### Task 5: MenuBar — @Aldair Garros prompt, >_ button

**Files:**
- Modify: `src/modules/MenuBar/index.tsx`

- [ ] **Step 1: Left prompt** (line 57-58):

Change `<span className="font-mono text-sm font-semibold text-emerald-500 dark:text-emerald-400">@...:~</span>` to:

```tsx
<span className="font-mono text-sm font-semibold text-emerald-500 dark:text-emerald-400">
  @{t("hero.title.value")}:~
</span>
```

- [ ] **Step 2: Remove the separate name span** (lines 60-62) — the prompt now contains the name. The Link becomes:

```tsx
          <Link
            to={{ pathname: "/", hash: "hero" }}
            className="flex items-center gap-2 font-mono text-sm font-semibold text-emerald-500 dark:text-emerald-400 hover:text-emerald-400 dark:hover:text-emerald-300 focus:ring-2 focus:ring-emerald-400 focus:outline-none rounded-none">
            @{t("hero.title.value")}:~
          </Link>
```

- [ ] **Step 3: Menu button text** (line 90):

Change `<span>@...:~</span>` to `<span>&gt;_</span>`.

- [ ] **Step 4: Verify + commit**

```bash
npm run build
git add src/modules/MenuBar/index.tsx
git commit -m "style: terminal prompt with name and >_ menu button"
```

---

### Task 6: Contact — fixed one-line footer

**Files:**
- Rewrite: `src/modules/Contact/index.tsx`
- Modify: `src/pages/Layout.tsx`
- Modify: `src/pages/home/index.tsx`

**Interfaces:**
- Produces: `export function ContactFooter()` — no props
- Consumes: `t` with keyPrefix `contact`; keys list unchanged

- [ ] **Step 1: Rewrite `src/modules/Contact/index.tsx`** — complete file:

```tsx
import { Mail, Phone, MessageCircle, Globe, GitBranch } from "lucide-react";
import { useTranslation } from "react-i18next";

const ICON_MAP: Record<string, typeof Mail> = {
  email: Mail,
  phone: Phone,
  whatsApp: MessageCircle,
  linkedIn: Globe,
  github: GitBranch,
};

const EXTERNAL_KEYS = ["whatsApp", "linkedIn", "github"];

export function ContactFooter() {
  const { t } = useTranslation("translation", { keyPrefix: "contact" });
  const keys = ["email", "phone", "whatsApp", "linkedIn", "github"] as const;

  return (
    <footer className="fixed bottom-0 w-full z-20 backdrop-blur-lg bg-white/10 dark:bg-white/5 border-t-2 border-t-zinc-400/50 dark:border-t-zinc-600/50">
      <div className="max-w-6xl mx-auto h-12 flex items-center justify-center sm:justify-between px-4 sm:px-8 font-mono text-xs sm:text-sm overflow-x-auto">
        <div className="hidden sm:flex items-center gap-2 text-primary-500 dark:text-primary-400">
          <span className="text-emerald-500">contact:</span>
          <span className="animate-pulse">█</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {keys.map((key, index) => {
            const href = t(`list.${key}.href`);
            const value = t(`list.${key}.value`);
            const isExternal = EXTERNAL_KEYS.includes(key);
            const Icon = ICON_MAP[key];

            const extraProps = isExternal
              ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
              : {};

            return (
              <span key={key} className="flex items-center gap-2 sm:gap-3">
                {index > 0 && <span className="text-primary-400 dark:text-primary-500" aria-hidden="true">|</span>}
                <a
                  href={href}
                  {...extraProps}
                  className="inline-flex items-center gap-1.5 text-primary-700 dark:text-primary-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none">
                  <Icon size={14} className="shrink-0" />
                  <span className="hidden md:inline">{value}</span>
                </a>
              </span>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Layout.tsx** — add ContactFooter:

```tsx
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MenuBar, type NavItem } from "@/modules/MenuBar";
import { BackgroundDecoration } from "@/components/BackgroundDecoration";
import { ContactFooter } from "@/modules/Contact";

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
  ];

  return (
    <div className="flex items-center justify-center">
      <MenuBar links={links} />
      <BackgroundDecoration />
      <Outlet />
      <ContactFooter />
    </div>
  );
}
```

Note: the `contact` menu link is removed (contact is now the footer). The `contact.title` translation key becomes unused — that's fine.

- [ ] **Step 3: home/index.tsx** — remove Contact, add footer clearance:

Change `import { Contact } from "@/modules/Contact";` → remove the line.
Change `<main className="flex min-h-screen flex-col">` → `<main className="flex min-h-screen flex-col pb-14">`.
Change `<Contact />` → remove the line.

- [ ] **Step 4: Verify + commit**

```bash
npm run build
git add src/modules/Contact/index.tsx src/pages/Layout.tsx src/pages/home/index.tsx
git commit -m "refactor: contact as fixed terminal footer"
```

---

### Task 7: Final verification — full monospace, no heading font

- [ ] **Step 1: Grep for font-heading / font-sans / rounded / gradient**

```bash
rg -n "font-heading|font-sans|rounded-|bg-gradient|from-emerald|to-emerald|via-" src/ --glob '*.tsx' --glob '*.css'
```

Expected: `font-heading` matches may remain ONLY in `src/globals.css` (the `--font-heading` variable definition). Any usage in components is a violation. `rounded-` and gradients should be zero.

- [ ] **Step 2: Build + lint**

```bash
npm run build && npm run lint
```

- [ ] **Step 3: Fix anything found, commit**

```bash
git add -A
git commit -m "chore: terminal v4 final verification" || echo "nothing to commit"
```
