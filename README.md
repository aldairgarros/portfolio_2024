# Aldair Garros · Portfolio

Personal portfolio and résumé site — a bilingual (English / Brazilian Portuguese) single-page app with a terminal / code-as-UI aesthetic, served at [aldairgarros.com](https://aldairgarros.com).

## Tech Stack

| Layer         | Technology                                                                          |
| ------------- | ----------------------------------------------------------------------------------- |
| Framework     | React 19 + TypeScript (strict) + Vite 8                                             |
| Styling       | Tailwind CSS v4 (theme in `src/globals.css` via `@theme`)                           |
| Routing       | react-router-dom v7 (hash-based section navigation)                                 |
| i18n          | i18next + react-i18next + browser language detector (`en` default/fallback, `br`)   |
| Animation     | framer-motion                                                                       |
| Icons         | react-icons (`lu` set for UI icons, `fa6` for brand logos)                          |
| Observability | OpenTelemetry web auto-instrumentation + web-vitals + Sentry (GlitchTip-compatible) |
| Testing       | Vitest + React Testing Library + jsdom                                              |
| Tooling       | ESLint (type-aware flat config), Prettier, husky + lint-staged, Commitizen          |

Requires Node.js >= 24 (LTS).

## Quick Start

```bash
npm install
npm run dev
```

## Scripts

| Script                  | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `npm run dev`           | Start the Vite dev server with HMR                        |
| `npm run build`         | Typecheck (`tsc -b`) then production build (`vite build`) |
| `npm run lint`          | ESLint (type-aware flat config) on the whole repo         |
| `npm run typecheck`     | Check types via `tsc -b` (project references)             |
| `npm test`              | Run tests once (Vitest)                                   |
| `npm run test:watch`    | Run tests in watch mode                                   |
| `npm run test:coverage` | Run tests with coverage report                            |
| `npm run format`        | Format the whole repo with Prettier                       |
| `npm run format:check`  | Verify formatting without writing                         |
| `npm run preview`       | Preview the production build locally                      |
| `npm run commit`        | Interactive conventional commit via Commitizen            |

## Architecture

Pages → Modules → Components:

```
src/
├── pages/          Route-level entry points (Layout, home)
├── modules/        Feature sections (Hero, About, Expertise, Education, Projects, Contact, MenuBar)
├── components/     Generic reusable UI (TerminalFrame, Lightbox, BackgroundDecoration)
├── context/        ActiveSectionContext (active section tracking)
├── observability/  OTel setup, GlitchTip/Sentry init, web-vitals, ErrorBoundary
└── locales/        Translation files (en.json, br.json)
```

- **i18n**: i18next + react-i18next with browser language detection; `en` is the default/fallback, `br` is Brazilian Portuguese. All user-facing text lives in `src/locales/`.
- **Observability**: OpenTelemetry web auto-instrumentation exports traces to an OTLP endpoint; web-vitals reports metrics; Sentry (GlitchTip-compatible) handles error tracking with trace IDs attached to events. An `ErrorBoundary` in `src/observability/` renders a user-facing fallback on render errors.
- **Data**: Static skill data in `src/assets/expertise.json`.

## Environment Variables

Copy `.env.example` to `.env` and set values as needed. Vite inlines them into the bundle at build time.

| Variable             | Description                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------- |
| `VITE_SENTRY_DSN`    | Sentry/GlitchTip DSN for error tracking (leave empty to disable)                          |
| `VITE_OTLP_ENDPOINT` | OpenTelemetry OTLP trace endpoint (empty in dev — falls back to a local console exporter) |

## Deployment

Continuous deployment via GitHub Actions (`.github/workflows/production.yml`) on pushes to `main`:

1. **Quality gate** — lint, typecheck, and test on Node 24.
2. **Container build** — multi-stage Docker build (`node:24-alpine` builder → `nginx:1.27-alpine`), with `VITE_SENTRY_DSN` and `VITE_OTLP_ENDPOINT` passed as build args.
3. **Security scan** — Trivy scans the image; CRITICAL/HIGH findings fail the pipeline.
4. **Registry** — image pushed to GHCR (`ghcr.io/aldairgarros/portfolio`).
5. **Deploy** — SSH to the VPS, `podman-compose up -d` (see `compose.portfolio.yml`), served on port 3070 behind nginx (`nginx.conf`, which also exposes a `/stub_status` metrics endpoint). A health check verifies the app responds; on failure the previous image is rolled back.

## SEO

`public/robots.txt`, `public/sitemap.xml`, and Open Graph / Twitter card / canonical meta tags are in place in `index.html`.
