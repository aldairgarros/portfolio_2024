# AGENTS.md

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — typecheck (`tsc -b`) then build (`vite build`); type errors fail the build
- `npm run lint` — ESLint (flat config) on the whole repo
- `npm run preview` — preview the production build locally
- `npm run commit` — interactive conventional commit via commitizen

No test suite exists — there is no test runner or test script.

## Architecture

React 19 + TypeScript + Vite SPA. Pages → Modules → Components:

| Layer      | Path              | Role                                                                                    |
| ---------- | ----------------- | --------------------------------------------------------------------------------------- |
| Pages      | `src/pages/`      | Route-level entry points (home, projects, project, about)                               |
| Modules    | `src/modules/`    | Feature-specific sections (Hero, Projects, Expertise, About, Contact, MenuBar, Sticker) |
| Components | `src/components/` | Generic reusable UI (Container, Section, TextBox, LinkButton, Attribute)                |

Routing via react-router-dom v7 in `src/router.tsx`. Home page uses hash-based section navigation (`/#projects`, `/#contact`, etc.).

## Path Alias

`@/` resolves to `src/`. Configured in both `vite.config.ts` and `tsconfig.app.json`. Always use `@/` for internal imports.

## i18n

- **Stack**: i18next + react-i18next + browser language detector
- **Languages**: `en` (default/fallback) and `br` (Brazilian Portuguese)
- **Translation files**: `src/locales/en.json` and `src/locales/br.json`
- **Usage**: `useTranslation("translation", { keyPrefix: "section.subsection" })` then `t("key")`
- **Switching**: `i18n.changeLanguage("en"|"br")` — controlled in MenuBar
- Debug mode is **on** in `src/i18n.ts`

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

- **Code-as-UI aesthetic**: Components like Container and Section render bracket decorations (`{`, `}`, `(`, `)`) as visual elements — do not remove or refactor these away.
- **Translation-driven content**: Nearly all user-facing text is in JSON locale files. Content changes = JSON edits, not component edits.
- **TypeScript strict mode**: `noUnusedLocals` and `noUnusedParameters` are enabled.
- **Static data**: `src/assets/expertise.json` holds skill categories and values.
- **No hardcoded user-facing strings** in components (only CSS classes and JSX structure).
- **File naming**: `.tsx` extension used even for interface-only files under `src/interfaces/`.
- **React 19**: `JSX` is no longer a global namespace — use `React.JSX.Element` for explicit return types.
