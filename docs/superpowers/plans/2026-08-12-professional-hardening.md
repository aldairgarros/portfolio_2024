# Professional Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the portfolio repo up to professional best-practice standards — tests, stricter static analysis, SEO/accessibility, env hygiene, formatting, CI hardening, and docs.

**Architecture:** A sequence of independent, individually-reviewable tasks. No runtime behavior changes to the app beyond the error-boundary fallback UI and env-driven OTLP URL; everything else is tooling/CI/docs/hygiene.

**Tech Stack:** Vitest + React Testing Library + jsdom, eslint-plugin-react + jsx-a11y + type-aware typescript-eslint, Prettier, husky + lint-staged, Trivy (image scan), Node 24 LTS.

**Key correction to earlier audit:** `MenuBar` already sets `document.documentElement.lang` at runtime (`src/modules/MenuBar/index.tsx:27`), so the static `lang="en"` in `index.html` is only a crawler-time concern, not a runtime bug. Also found a **new bug**: `npm run typecheck` runs `tsc --noEmit` against the root `tsconfig.json` (which has `files: []` + references), so it typechecks _nothing_ — CI's typecheck step is a no-op.

## Global Constraints

- Use `@/` path alias for all internal imports.
- No hardcoded user-facing strings in components — text lives in `src/locales/{en,br}.json`.
- TypeScript strict mode on; `noUnusedLocals`/`noUnusedParameters` enabled.
- Never remove the code-as-UI bracket decorations (Container/Section).
- Node pinned to **24 LTS** everywhere; no `--legacy-peer-deps` unless a documented, unresolved conflict forces it.
- Commit per task with conventional-commit messages (`npm run commit` or `git commit -m "type(scope): ..."`).

---

### Task 1: Repo hygiene — remove junk, fix `.gitignore`

**Files:**

- Modify: `.gitignore`
- Delete from git (keep working-tree file removed too): `session-ses_05b2.md`, `public/images/.DS_Store`

- [ ] **Step 1: Remove tracked junk and untrack `.DS_Store` everywhere**

```bash
git rm --cached session-ses_05b2.md
git rm --cached public/images/.DS_Store
```

Note: use `git rm` (files physically deleted from disk, not just unstaged) — the session file and `.DS_Store` have no reason to remain.

- [ ] **Step 2: Add ignore rules to `.gitignore`**

Append:

```gitignore
# AI/agent artifacts
session-*.md
.opencode/
.superpowers/
```

Note: `.DS_Store` is already ignored (`*.local` block has `.DS_Store`), it was just committed before the rule existed.

- [ ] **Step 3: Verify clean status**

Run: `git status --short`
Expected: only the deletions staged; `session-ses_05b2.md` and `.DS_Store` no longer listed as tracked.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore: remove committed session log and .DS_Store"
```

---

### Task 2: Node 24 LTS + engines + resolve peer deps

**Files:**

- Modify: `.github/workflows/production.yml:29`
- Modify: `Dockerfile:2`
- Modify: `package.json`

- [ ] **Step 1: Pin CI to Node 24**

In `production.yml`, change `node-version: "23"` → `node-version: "24"`.

- [ ] **Step 2: Pin Docker build stage**

In `Dockerfile`, change `FROM node:23-alpine AS builder` → `FROM node:24-alpine AS builder`.

- [ ] **Step 3: Add `engines` field to `package.json`**

```json
"engines": {
  "node": ">=24.0.0"
},
```

- [ ] **Step 4: Try removing `--legacy-peer-deps`**

Run: `npm ci --no-audit --no-fund`
Expected: if it installs cleanly, remove `--legacy-peer-deps` from both `production.yml` and `Dockerfile`. If it fails with an ERESOLVE peer conflict, run `npm ls <conflicting-pkg>` to identify it, pin/resolve, and document the resolution in the commit message. (Fallback: keep the flag with a `# ERESOLVE: <reason>` comment — do not silently keep it.)

- [ ] **Step 5: Verify CI/Docker parity**

Run: `npm ci --no-audit --no-fund` locally
Expected: exit 0, no peer warnings.

- [ ] **Step 6: Commit**

```bash
git commit -m "chore: pin Node 24 LTS and add engines field"
```

---

### Task 3: Fix the broken `typecheck` script

**Files:**

- Modify: `package.json:12`

- [ ] **Step 1: Confirm the no-op**

Run: `npx tsc --noEmit` (already verified: exits 0, checks nothing because root tsconfig has `files: []`).

- [ ] **Step 2: Point `typecheck` at the project references**

Change the script from `"typecheck": "tsc --noEmit"` to:

```json
"typecheck": "tsc -b"
```

- [ ] **Step 3: Verify it actually typechecks**

Run: `npm run typecheck`
Expected: exit 0 with no errors (both `tsconfig.app.json` and `tsconfig.node.json` built/checked). To sanity-check it's live, temporarily add `const x: number = "nope";` to any file, run, confirm a TS error, then revert.

- [ ] **Step 4: Commit**

```bash
git commit -m "fix: make typecheck actually check project references"
```

---

### Task 4: Test infrastructure (Vitest + RTL + jsdom)

**Files:**

- Modify: `package.json`
- Modify: `vite.config.ts`
- Create: `src/test/setup.ts`
- Modify: `tsconfig.app.json`

- [ ] **Step 1: Install dev dependencies**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

- [ ] **Step 2: Add test scripts to `package.json`**

```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

- [ ] **Step 3: Add Vitest config to `vite.config.ts`**

Add `/// <reference types="vitest/config" />` at the very top, then add a `test` block:

```ts
/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
```

- [ ] **Step 4: Create `src/test/setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
import { MotionGlobalConfig } from "framer-motion";

MotionGlobalConfig.skipAnimations = true;

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  disconnect(): void {}
  observe(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve(): void {}
}

globalThis.IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }),
});
```

- [ ] **Step 5: Add Vitest types to `tsconfig.app.json`**

Add `"vitest/globals"` and `"@testing-library/jest-dom"` to `compilerOptions.types`:

```json
"types": ["vitest/globals", "@testing-library/jest-dom"]
```

- [ ] **Step 6: Verify**

Run: `npm run test`
Expected: "No test files found" (exit non-zero is fine at this stage) — confirms runner works.

- [ ] **Step 7: Commit**

```bash
git commit -m "test: scaffold Vitest + React Testing Library + jsdom"
```

---

### Task 5: First component/unit tests (TDD)

**Files:**

- Create: `src/components/TerminalFrame/TerminalFrame.test.tsx`
- Create: `src/modules/Contact/Contact.test.tsx`
- Create: `src/modules/MenuBar/MenuBar.test.tsx`

**Interfaces:**

- Consumes: `TerminalFrame`, `TerminalPanel`, `TerminalSeparator` from `@/components/TerminalFrame`; `ContactFooter` from `@/modules/Contact`; `MenuBar` + `NavItem` from `@/modules/MenuBar`; `ActiveSectionProvider` from `@/context/ActiveSectionContext`.

- [ ] **Step 1: Write `TerminalFrame.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TerminalFrame, TerminalPanel, TerminalSeparator } from "./index";

describe("TerminalFrame", () => {
  it("renders title and children", () => {
    render(<TerminalFrame title="projects">content</TerminalFrame>);
    expect(screen.getByText("projects")).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("renders without a title", () => {
    render(<TerminalFrame>content</TerminalFrame>);
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});

describe("TerminalPanel", () => {
  it("renders title and children", () => {
    render(<TerminalPanel title="panel">body</TerminalPanel>);
    expect(screen.getByText("panel")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });
});

describe("TerminalSeparator", () => {
  it("renders a decorative divider", () => {
    const { container } = render(<TerminalSeparator />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run to verify pass**

Run: `npx vitest run src/components/TerminalFrame/TerminalFrame.test.tsx`
Expected: PASS (3 suites).

- [ ] **Step 3: Write `Contact.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { ContactFooter } from "./index";

describe("ContactFooter", () => {
  it("renders email, phone, and social links", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ContactFooter />
      </I18nextProvider>,
    );
    expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /phone/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
  });

  it("opens external links in a new tab", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ContactFooter />
      </I18nextProvider>,
    );
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute("target", "_blank");
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });
});
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run src/modules/Contact/Contact.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write `MenuBar.test.tsx`**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { describe, expect, it } from "vitest";
import i18n from "@/i18n";
import { ActiveSectionProvider } from "@/context/ActiveSectionContext";
import { MenuBar, type NavItem } from "./index";

const links: NavItem[] = [
  { label: "about", hash: "about" },
  { label: "projects", hash: "projects", children: [{ label: "Penhor", hash: "penhor" }] },
];

function renderMenuBar() {
  const router = createMemoryRouter([
    {
      path: "/",
      element: (
        <ActiveSectionProvider>
          <MenuBar links={links} />
        </ActiveSectionProvider>
      ),
    },
  ]);
  return render(
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>,
  );
}

describe("MenuBar", () => {
  it("opens the menu and shows nav items", async () => {
    const user = userEvent.setup();
    renderMenuBar();
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("menuitem", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /penhor/i })).toBeInTheDocument();
  });

  it("switches language", async () => {
    const user = userEvent.setup();
    renderMenuBar();
    await user.click(screen.getByRole("button", { name: /mudar para português/i }));
    expect(document.documentElement.lang).toBe("br");
  });
});
```

- [ ] **Step 6: Run full suite**

Run: `npm run test`
Expected: all tests PASS.

- [ ] **Step 7: Commit**

```bash
git commit -m "test: cover TerminalFrame, ContactFooter, and MenuBar"
```

---

### Task 6: Add test step to CI

**Files:**

- Modify: `.github/workflows/production.yml:31-33`

- [ ] **Step 1: Add `test` run to the `quality` job**

After the `typecheck` line, add:

```yaml
- run: npm run test
```

- [ ] **Step 2: Commit**

```bash
git commit -m "ci: run test suite in quality job"
```

---

### Task 7: ESLint hardening (type-aware + react + jsx-a11y)

**Files:**

- Modify: `eslint.config.js`

- [ ] **Step 1: Install plugins**

```bash
npm install -D eslint-plugin-react eslint-plugin-jsx-a11y
```

- [ ] **Step 2: Replace `eslint.config.js`**

```js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "coverage"] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommendedTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      react,
      "jsx-a11y": jsxA11y,
    },
    settings: { react: { version: "19.2" } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...jsxA11y.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
);
```

- [ ] **Step 3: Run lint and fix findings**

Run: `npm run lint`
Expected known findings and their fixes:

- `jsx-a11y/no-noninteractive-element-interactions` / `click-events-have-key-events` on the clickable `<img>` in `ProjectDetail.tsx:79` and the lightbox image — resolve in Task 8.
- `@typescript-eslint/no-unsafe-*` on `p("images.list", { returnObjects: true }) as Record<string, unknown>` in `ProjectDetail.tsx:15` — if flagged, add a targeted `// eslint-disable-next-line` with a comment, or refactor to a typed helper.
- `react-refresh/only-export-components` on `ActiveSectionContext.tsx` — already silenced with an inline disable at line 1; verify it still holds.

**Important:** If lint finds additional unexpected errors beyond the known findings, fix the _correct_ ones in this task where the fix is a one-line change (e.g. missing `type` in import), and leave structural a11y issues for Task 8. Do not bulk-disable rules to make lint pass. If a finding is genuinely unfixable in this task, note it in the report and verify lint exits 0 by the end of Task 8.

- [ ] **Step 4: Verify**

Run: `npm run lint`
Expected: exit 0 — with the sole exception of the two known `jsx-a11y` findings on the clickable `<img>` elements (`ProjectDetail.tsx:79` and the `Lightbox` image) documented above, which Task 8 resolves. Any other remaining errors must be fixed here.

- [ ] **Step 5: Commit**

```bash
git commit -m "chore: enable type-aware, react, and jsx-a11y lint rules"
```

---

### Task 8: Accessibility + i18n fixes for interactive elements

**Files:**

- Modify: `src/components/Lightbox/index.tsx`
- Modify: `src/modules/Projects/ProjectDetail.tsx`
- Modify: `src/locales/en.json`, `src/locales/br.json`

**Interfaces:**

- Adds translation keys under a new `lightbox` namespace: `lightbox.close`, `lightbox.previous`, `lightbox.next`.

- [ ] **Step 1: Add lightbox aria-label keys to `en.json`**

```json
"lightbox": {
  "close": "Close lightbox",
  "previous": "Previous image",
  "next": "Next image"
}
```

(Mirror in `br.json` with Portuguese: "Fechar lightbox", "Imagem anterior", "Próxima imagem".)

- [ ] **Step 2: Make `Lightbox` translate its aria-labels**

In `Lightbox/index.tsx`, add `const { t } = useTranslation("translation", { keyPrefix: "lightbox" });` and replace the hardcoded labels:

- `aria-label="Close lightbox"` → `aria-label={t("close")}`
- `aria-label="Previous image"` → `aria-label={t("previous")}`
- `aria-label="Next image"` → `aria-label={t("next")}`

- [ ] **Step 3: Make project image strip keyboard-accessible**

In `ProjectDetail.tsx`, the scroll buttons already have labels (`aria-label="Previous images"` / `"Next images"`). Move those to translation keys `projects.list.<id>.image.prevLabel` / `nextLabel` (add the keys to both locale files). For the clickable `<img>` (line 79) add keyboard support:

```tsx
role="button"
tabIndex={0}
onKeyDown={(e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    openLightbox(index);
  }
}}
```

Also add `alt` translations for the project image strip if missing (images already have `alt` from locale `images.list.<key>.alt`; main image uses `image.alt` — both already exist).

- [ ] **Step 4: Run lint + tests**

Run: `npm run lint && npm run test`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git commit -m "fix: translate lightbox labels and make image strip keyboard-accessible"
```

---

### Task 9: SEO & meta (robots, sitemap, Open Graph)

**Files:**

- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Modify: `index.html`

- [ ] **Step 1: Create `public/robots.txt`**

```txt
User-agent: *
Allow: /

Sitemap: https://aldairgarros.com/sitemap.xml
```

- [ ] **Step 2: Create `public/sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://aldairgarros.com/</loc>
    <lastmod>2026-08-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

- [ ] **Step 3: Add Open Graph / Twitter / canonical to `index.html`**

Add inside `<head>`:

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Aldair Garros — Developer & Software Engineering Specialist" />
<meta
  property="og:description"
  content="Fullstack Developer & Software Engineering Specialist. Portfolio showcasing web and mobile development projects."
/>
<meta property="og:url" content="https://aldairgarros.com/" />
<meta name="twitter:card" content="summary" />
<meta name="twitter:title" content="Aldair Garros — Developer & Software Engineering Specialist" />
<meta
  name="twitter:description"
  content="Fullstack Developer & Software Engineering Specialist. Portfolio showcasing web and mobile development projects."
/>
<link rel="canonical" href="https://aldairgarros.com/" />
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: succeeds; `dist/robots.txt` and `dist/sitemap.xml` present.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add robots, sitemap, and Open Graph meta tags"
```

---

### Task 10: Env hygiene — `.env.example` + env-driven OTLP URL

**Files:**

- Create: `.env.example`
- Modify: `src/observability/otel.ts:39`
- Modify: `Dockerfile`
- Modify: `.github/workflows/production.yml`

- [ ] **Step 1: Create `.env.example`**

```bash
# Sentry/GlitchTip error tracking (https://sentry.io or GlitchTip DSN)
VITE_SENTRY_DSN=

# OpenTelemetry OTLP trace endpoint (leave empty in dev; defaults to local console exporter)
VITE_OTLP_ENDPOINT=https://aldairgarros.com/v1/traces
```

- [ ] **Step 2: Drive the OTLP URL from env**

In `otel.ts`, replace the hardcoded URL:

```ts
} else {
  spanProcessors.push(
    new BatchSpanProcessor(
      new OTLPTraceExporter({
        url: import.meta.env.VITE_OTLP_ENDPOINT as string,
      }),
    ),
  );
}
```

- [ ] **Step 3: Pass through Docker build arg**

In `Dockerfile`, add `ARG VITE_OTLP_ENDPOINT` / `ENV VITE_OTLP_ENDPOINT=$VITE_OTLP_ENDPOINT` alongside the existing `VITE_SENTRY_DSN`, and add the matching `--build-arg VITE_OTLP_ENDPOINT="${{ secrets.VITE_OTLP_ENDPOINT }}"` in `production.yml` build step.

- [ ] **Step 4: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat: add .env.example and make OTLP endpoint configurable"
```

---

### Task 11: Formatting (Prettier) + git hooks (husky + lint-staged)

**Files:**

- Modify: `package.json`
- Create: `.prettierrc.json`, `.prettierignore`
- Create: `.husky/pre-commit` (via husky init)

- [ ] **Step 1: Install**

```bash
npm install -D prettier husky lint-staged
npx husky init
```

- [ ] **Step 2: Add scripts and config to `package.json`**

```json
"format": "prettier --write .",
"format:check": "prettier --check .",
"prepare": "husky"
```

And:

```json
"lint-staged": {
  "*.{ts,tsx,js,json,md,css,yml,yaml}": "prettier --write"
}
```

- [ ] **Step 3: Create `.prettierrc.json`**

```json
{
  "printWidth": 100,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all"
}
```

- [ ] **Step 4: Create `.prettierignore`**

```txt
dist
coverage
package-lock.json
node_modules
```

- [ ] **Step 5: Set the pre-commit hook**

Edit `.husky/pre-commit` to:

```sh
npx lint-staged
```

- [ ] **Step 6: Run a full format pass and verify nothing breaks**

Run: `npm run format && npm run lint && npm run test && npm run build`
Expected: all exit 0. Note: this formats the whole repo in one go — commit separately.

- [ ] **Step 7: Commit**

```bash
git commit -m "chore: add Prettier, husky, and lint-staged"
```

---

### Task 12: Error boundary fallback UI

**Files:**

- Modify: `src/observability/ErrorBoundary.tsx`
- Modify: `src/locales/en.json`, `src/locales/br.json`

- [ ] **Step 1: Add fallback keys to locales**

`en.json`:

```json
"error": {
  "title": "Something went wrong",
  "message": "An unexpected error occurred. Please reload the page.",
  "reload": "Reload"
}
```

(Mirror in `br.json`: "Algo deu errado", "Ocorreu um erro inesperado. Recarregue a página.", "Recarregar".)

- [ ] **Step 2: Implement a fallback component**

Replace `ErrorBoundary.tsx`:

```tsx
import type { ReactNode } from "react";
import * as Sentry from "@sentry/react";
import { useTranslation } from "react-i18next";

function Fallback(): React.JSX.Element {
  const { t } = useTranslation("translation", { keyPrefix: "error" });
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center font-mono">
      <h1 className="text-2xl text-emerald-600 dark:text-emerald-400">{t("title")}</h1>
      <p className="text-zinc-700 dark:text-zinc-300">{t("message")}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-emerald-500 px-6 py-3 text-white hover:bg-emerald-600"
      >
        {t("reload")}
      </button>
    </div>
  );
}

export function GlitchTipErrorBoundary({ children }: { children: ReactNode }): React.JSX.Element {
  return <Sentry.ErrorBoundary fallback={<Fallback />}>{children}</Sentry.ErrorBoundary>;
}
```

- [ ] **Step 3: Verify build + lint**

Run: `npm run build && npm run lint`
Expected: exit 0.

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: add user-facing error boundary fallback"
```

---

### Task 13: CI hardening — image scanning + versioning/CHANGELOG

**Files:**

- Modify: `.github/workflows/production.yml`
- Create: `CHANGELOG.md`

- [ ] **Step 1: Add a Trivy scan step after `docker build`**

In `production.yml`, insert after the "Build container image" step:

```yaml
- name: Scan image for vulnerabilities
  uses: aquasecurity/trivy-action@0.24.0
  with:
    image-ref: ghcr.io/aldairgarros/portfolio:${{ github.sha }}
    severity: CRITICAL,HIGH
    exit-code: "1"
    ignore-unfixed: true
```

- [ ] **Step 2: Create `CHANGELOG.md`**

Use [Keep a Changelog](https://keepachangelog.com) format:

```md
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
```

- [ ] **Step 3: Verify the workflow is valid**

Manually review the YAML (indentation, quoting). No auto-commit; the scan runs on next push.

- [ ] **Step 4: Commit**

```bash
git commit -m "ci: add Trivy image scan and CHANGELOG"
```

---

### Task 14: Rewrite README + update AGENTS.md

**Files:**

- Modify: `README.md`
- Modify: `AGENTS.md`

- [ ] **Step 1: Rewrite `README.md`**

Replace the Vite boilerplate with a real README: project title/one-liner, tech stack table, quick start (`npm install`, `npm run dev`), scripts (`dev`, `build`, `lint`, `test`, `format`, `commit`), architecture summary (pages/modules/components, i18n, observability), deployment notes (GitHub Actions → GHCR → VPS via compose), and env vars (`VITE_SENTRY_DSN`, `VITE_OTLP_ENDPOINT`).

- [ ] **Step 2: Update `AGENTS.md`**

Fix the stale bits:

- Add `npm run test`, `npm run test:watch`, `npm run format` to Commands; note "No e2e/Playwright suite — component + unit tests via Vitest".
- Change the i18n "Debug mode is on" line to `debug: import.meta.env.DEV` (only in dev).
- Correct the Components row — the generic components are now `TerminalFrame`, `Lightbox`, `BackgroundDecoration` (not Container/Section/TextBox/LinkButton/Attribute).
- Note `typecheck` is `tsc -b`.

- [ ] **Step 3: Verify docs are consistent**

Run: `git diff --stat` review; no code changes expected.

- [ ] **Step 4: Commit**

```bash
git commit -m "docs: rewrite README and refresh AGENTS.md"
```

---

## Verification checklist (before final sign-off)

- [ ] `npm run lint` — 0 errors
- [ ] `npm run typecheck` — actually checks (confirmed live by a temporary type error)
- [ ] `npm run test` — all pass
- [ ] `npm run build` — succeeds
- [ ] `git status` — no stray `session-*.md`, `.DS_Store`, or `.tsbuildinfo`
- [ ] CI workflow: `quality` job runs lint + typecheck + test; deploy job includes Trivy scan
