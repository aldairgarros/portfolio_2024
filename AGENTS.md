# AGENTS.md

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — typecheck (`tsc -b`) then build (`vite build`); type errors fail the build
- `npm run lint` — ESLint (flat config) on the whole repo
- `npm run typecheck` — check types via `tsc -b` (project references)
- `npm test` — run tests once (Vitest)
- `npm run test:watch` — run tests in watch mode
- `npm run test:coverage` — run tests with coverage report
- `npm run format` — format the whole repo with Prettier
- `npm run format:check` — verify formatting without writing
- `npm run preview` — preview the production build locally
- `npm run commit` — interactive conventional commit via commitizen

No e2e/Playwright suite — unit + component tests via Vitest + React Testing Library + jsdom.

## Architecture

React 19 + TypeScript + Vite SPA. Pages → Modules → Components:

| Layer      | Path              | Role                                                                                              |
| ---------- | ----------------- | ------------------------------------------------------------------------------------------------- |
| Pages      | `src/pages/`      | Route-level entry points (Layout, home)                                                           |
| Modules    | `src/modules/`    | Feature-specific sections (Hero, Experiences, Expertise, Credentials, Projects, Contact, MenuBar) |
| Components | `src/components/` | Generic reusable UI (Section primitives, Card, TerminalFrame, Lightbox, BackgroundDecoration)     |

Routing via react-router-dom v7 in `src/router.tsx`. Home page uses hash-based section navigation (`/#projects`, `/#contact`, etc.).

### Section primitives

All content sections compose the same vocabulary from `src/components/`:

| Component        | Role                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `Section`        | Outer `<section>` (id, section ref, background)                                                                                |
| `SectionTitle`   | The section `h2` heading                                                                                                       |
| `SectionHeader`  | Item-level `h3` + subtitle + description; responsive config passed inline via `className`/`titleClassName`/`subtitleClassName` |
| `SectionContent` | Standardized content container (`stack`/`grid` variants)                                                                       |
| `SectionItem`    | Animated item wrapper (fade-up + active-section registration)                                                                  |
| `Card`           | Shade container (`white`/`soft`/`gray`/`green`)                                                                                |
| `CardLabel`      | Uppercase card heading                                                                                                         |
| `ArrowList`      | Emerald `>` bullet list                                                                                                        |
| `SkillIcon`      | Skill image with shared `skill_images/` path handling                                                                          |

Conventions:

- `SectionItem` takes `id`, `path` (the `~/...` menubar path), and optional `delay`; it owns its own `useActiveSection` registration — do not wire refs manually in modules.
- Use `trigger="inherit"` only when items are animated by a parent stagger container (see `Expertise`).
- Framer-motion variants live in `src/lib/motion.ts` (`fadeUpVariants`, `staggerContainerVariants`); image paths in `src/lib/assets.ts` (`skillImageSrc`).

## Path Alias

`@/` resolves to `src/`. Configured in both `vite.config.ts` and `tsconfig.app.json`. Always use `@/` for internal imports.

## i18n

- **Stack**: i18next + react-i18next + browser language detector
- **Languages**: `en` (default/fallback) and `br` (Brazilian Portuguese)
- **Translation files**: `src/locales/en.json` and `src/locales/br.json`
- **Usage**: `useTranslation("translation", { keyPrefix: "section.subsection" })` then `t("key")`
- **Switching**: `i18n.changeLanguage("en"|"br")` — controlled in MenuBar
- Debug mode is on only in dev (`debug: import.meta.env.DEV` in `src/i18n.ts`)

## Styling

Tailwind CSS v4 via `@tailwindcss/vite` Vite plugin. Configuration is in `src/globals.css` using `@theme`. No `tailwind.config.js` or `postcss.config.js`.

Custom color aliases (map Tailwind palettes):

- `primary` → zinc
- `secondary` → rose
- `off` → neutral
- `warning` → orange
- `danger` → red
- `success` → green

Dark mode uses `prefers-color-scheme` media query. No class-based toggle.

## Key Conventions

- **Code-as-UI aesthetic**: Components like TerminalFrame and TerminalPanel render terminal-window chrome (mono fonts, emerald accents, separators) as visual elements — do not remove or refactor these away.
- **Translation-driven content**: Nearly all user-facing text is in JSON locale files. Content changes = JSON edits, not component edits.
- **TypeScript strict mode**: `noUnusedLocals` and `noUnusedParameters` are enabled.
- **Static data**: `src/assets/expertise.json` holds skill categories and values.
- **No hardcoded user-facing strings** in components (only CSS classes and JSX structure).
- **File naming**: `.tsx` extension used even for interface-only files under `src/interfaces/`.
- **React 19**: `JSX` is no longer a global namespace — use `React.JSX.Element` for explicit return types.
