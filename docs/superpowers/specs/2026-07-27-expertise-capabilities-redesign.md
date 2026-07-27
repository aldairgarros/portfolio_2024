# Expertise Section — Professional Capabilities Redesign

**Date:** 2026-07-27
**Scope:** Replace tech badge grids with narrative capability cards

## Summary

Replace the current Expertise section (3 tech badge grids: backend/frontend/general) with 4 professional capability cards. Each card tells a narrative through three attributes (context, applicability, impact) and retains supplementary tech badges.

## Files Changed

| File | Action |
|---|---|
| `src/assets/expertise.json` | Restructure from `[{name, values[]}]` to `[{id, title, context, applicability, impact, tech[]}]` |
| `src/modules/Expertise/index.tsx` | Rewrite — map over capabilities into a responsive 2-column card grid |
| `src/modules/Expertise/Skill.tsx` | Unchanged — reused as tech badge renderer |
| `src/locales/en.json` | Replace `expertise.list` with capability translations (context/applicability/impact per capability) |
| `src/locales/br.json` | Mirror structure with Brazilian Portuguese translations |

## Data Model (`expertise.json`)

```jsonc
[
  {
    "id": "api-backend",
    "title": "API & Backend Systems",
    "context": "...",
    "applicability": "...",
    "impact": "...",
    "tech": ["node", "express", "prisma", "sql", "mongodb", "rest", "jwt"]
  },
  {
    "id": "frontend-engineering",
    "title": "Modern Frontend Engineering",
    "applicability": "...",
    "impact": "...",
    "tech": ["react", "nextjs", "typescript", "tailwind", "redux", "vite"]
  },
  {
    "id": "mobile",
    "title": "Mobile Development",
    "applicability": "...",
    "impact": "...",
    "tech": ["reactNative", "typescript"]
  },
  {
    "id": "ux-strategy",
    "title": "UX Strategy & Design",
    "applicability": "...",
    "impact": "...",
    "tech": ["ui", "ux", "designPatterns"]
  }
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

## Layout & Styling

- Responsive grid: 1 column on mobile, 2 columns on `md+`
- GlassCards with hover effect, consistent padding with About section
- Attribute component reused (label/value pairs with dark mode)
- Tech badges at bottom of each card with `flex-wrap gap-2`

## Migration Notes

- The `Skill` component translation path uses `expertise` (the capability id) as the prefix. Changing from `backend`/`frontend`/`general` to `api-backend`/etc. requires the locale structure to include `list.<capabilityId>.list.<techKey>` entries for each tech in that capability's array.
- Tech keys like `node`, `react`, etc. must appear under their relevant capability's `list` in the locale JSON.
