# Expertise Section — Professional Capabilities Redesign

**Date:** 2026-07-27
**Scope:** Replace tech badge grids with narrative capability cards

## Summary

Replace the current Expertise section (3 tech badge grids: backend/frontend/general) with 5 professional capability cards. Each card tells a narrative through three attributes (context, applicability, impact) and retains supplementary tech badges.

## Files Changed

| File                              | Action                                                                                              |
| --------------------------------- | --------------------------------------------------------------------------------------------------- |
| `src/assets/expertise.json`       | Restructure from `[{name, values[]}]` to `[{id, title, context, applicability, impact, tech[]}]`    |
| `src/modules/Expertise/index.tsx` | Rewrite — map over capabilities into a responsive 2-column card grid                                |
| `src/modules/Expertise/Skill.tsx` | Unchanged — reused as tech badge renderer                                                           |
| `src/locales/en.json`             | Replace `expertise.list` with capability translations (context/applicability/impact per capability) |
| `src/locales/br.json`             | Mirror structure with Brazilian Portuguese translations                                             |

## Data Model (`expertise.json`)

```jsonc
[
  {
    "id": "api-backend",
    "title": "API & Backend Systems",
    "applicability": "...",
    "impact": "...",
    "tech": ["node", "express", "fastify", "sql", "mongodb", "prisma", "rest", "jwt"],
  },
  {
    "id": "frontend-engineering",
    "title": "Modern Frontend Engineering",
    "applicability": "...",
    "impact": "...",
    "tech": [
      "react",
      "nextjs",
      "typescript",
      "tailwind",
      "redux",
      "vite",
      "html",
      "css",
      "javascript",
    ],
  },
  {
    "id": "mobile",
    "title": "Mobile Development",
    "applicability": "...",
    "impact": "...",
    "tech": ["reactNative", "typescript", "jest", "solid", "designPatterns"],
  },
  {
    "id": "devops",
    "title": "DevOps & Infrastructure",
    "applicability": "...",
    "impact": "...",
    "tech": ["docker", "nginx", "apache", "git", "strapi"],
  },
  {
    "id": "ux-strategy",
    "title": "UX Strategy & Design",
    "applicability": "...",
    "impact": "...",
    "tech": ["ui", "ux"],
  },
]
```

Note: The `tech` array keys reference existing tech entries in locale JSON (unchanged), so the existing `Skill` component can read `t("list.<capabilityId>.list.<techKey>.label")` and `t("list.<capabilityId>.list.<techKey>.imageSrc")`.

## Component Architecture

```
<Expertise>
  <SectionTitle title={t("title")} />
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {capabilities.map(cap =>
      <GlassCard hover key={cap.id}>
        <h3>{t("list." + cap.id + ".title")}</h3>
        <div className="space-y-4">
          <Attribute label={t("contextLabel")}  value={t("list." + cap.id + ".context")} />
          <Attribute label={t("applicabilityLabel")} value={t("list." + cap.id + ".applicability")} />
          <Attribute label={t("impactLabel")} value={t("list." + cap.id + ".impact")} />
        </div>
        <div className="flex flex-wrap gap-2 mt-6">
          {cap.tech.map(t => <Skill key={t} expertise={cap.id} skill={t} />)}
        </div>
      </GlassCard>
    )}
  </div>
</Expertise>
```

## Translation Schema

Three new label keys at the expertise root level:

- `contextLabel`: "context"
- `applicabilityLabel`: "applicability"
- `impactLabel`: "impact"

Capability entries under `expertise.list.<id>` with: `title`, `context`, `applicability`, `impact`.

Tech badge labels under `expertise.list.<id>.list.<techKey>` (matches the existing `Skill` component's translation path: `list.${expertise}.list.${skill}.label`).

## Capability Descriptions (from project exploration)

### API & Backend Systems

Based on: atalaia-server (Fastify 5, ~80 endpoints, JWT, role-based auth via Drizzle ORM on PostgreSQL 17), music-market API (Koa 2, raw SQL, OAuth Firebase, ~80 endpoints, 19 tables), budget-backend (Express, Sequelize, MariaDB), podcast-app API (Fastify 5, Zod validation, auto-generated Swagger).

### Modern Frontend Engineering

Based on: atalaia SPA (React 19, TypeScript 6, Vite 8, Tailwind v4, Zustand, TanStack Query/Table, PWA offline, 12 pages, ~60+ components), penhor (Next.js 16, React 19, Prisma 7, ~14 pages, 24 DB tables, audit trail), music-market admin (React 18, Vite 5, Tailwind 3, 12 routes, admin dashboard), portfolio_2024 (React 19, Vite 8, i18next en/br, code-as-UI aesthetic).

### Mobile Development

Based on: Bolso Bom (React Native, TypeScript, PostgreSQL, personal finance app), Music Market mobile app, Podcast App mobile app. Cross-platform Android/iOS with shared TypeScript logic.

### DevOps & Infrastructure

Based on: vps-infrastructure (LGTM stack on Podman: Loki, Grafana, Tempo, Prometheus + 6 exporters, 14 alert rules, 8 dashboards, SLO alerting at 99.5%, GitOps CI/CD with auto-rollback). Docker/Podman Compose across all projects, GitHub Actions CI/CD, VPS deploys via SSH, Nginx reverse proxies, PostgreSQL exporter integration.

### UX Strategy & Design

Based on: 3 freelance UI/UX design projects using Spiral UX UI Continuous methodology (Double Diamond abstraction) with Figma. User research, interviews, journey mapping, wireframes, usability testing, high-fidelity prototypes.

## Layout & Styling

- Responsive grid: 1 column on mobile, 2 columns on `md+`
- 5th card (DevOps) spans full width on the last row via `md:col-span-2` when odd count
- GlassCards with hover effect, consistent padding with About section
- Attribute component reused (label/value pairs with dark mode)
- Tech badges at bottom of each card with `flex-wrap gap-2`

## Migration Notes

- The `Skill` component translation path uses `expertise` (the capability id) as the prefix. Changing from `backend`/`frontend`/`general` to `api-backend`/`frontend-engineering`/`mobile`/`devops`/`ux-strategy` requires the locale structure to include `list.<capabilityId>.list.<techKey>` entries for each tech in that capability's array.
- Tech keys like `node`, `react`, etc. must appear under their relevant capability's `list` in the locale JSON.
- New tech key added: `fastify` (needs `fastify.png` image in `public/skill_images/`).
- Some tech keys (`jest`, `solid`, `designPatterns`, `html`, `css`, `javascript`) were redistributed from the old `general` category across capabilities.
- The 5th card (odd count in 2-col grid) needs `md:col-span-2` applied conditionally.
