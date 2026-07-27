# Portfolio Overhaul — Design Spec

> **Goal:** Modernize the portfolio from a code-as-UI bracket aesthetic to a glassmorphism design while fixing all bugs, cleaning up dead code, adding an Education section, and improving content quality.

**Approach:** Replace bracket-decorated components (Container, Section) with glass-morphism cards. Fix 5 functional bugs. Remove dead code. Add Education section. Improve content and flow for a software engineering specialist positioning.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Vite 8, react-router-dom v7, i18next, Google Fonts (Inter).

---

## Architecture

### Routing (simplified to single-page)

```
/                    → Home (all sections scrollable: hero, education, projects, expertise, about, contact)
/projects/:project   → Project detail page
```

**Removed routes:** `/about`, `/projects`, `/:locale?`

### Component tree

```
App
├── Layout (MenuBar + Outlet)
│   ├── Home (/)
│   │   ├── Hero
│   │   ├── Education (NEW)
│   │   ├── Projects
│   │   ├── Expertise
│   │   ├── About
│   │   └── Contact
│   └── Project (/projects/:project)
│       ├── ProjectDetail content
│       ├── ProjectList (other projects)
│       └── Contact
├── MenuBar
│   ├── Nav links (hash anchors)
│   ├── LanguageSwitcher (pill toggle)
│   └── MobileMenu (FullScreenMenu replacement)
└── Sticker (email, desktop only)
```

### Deleted files

| File | Reason |
|------|--------|
| `src/components/Container/index.tsx` | Replaced by glass card pattern |
| `src/components/Section/index.tsx` | Replaced by simple section wrapper |
| `src/components/LinkButton/index.tsx` | Dead code — never imported |
| `src/components/Attribute/Link.tsx` | Dead code — never imported |
| `src/components/Attribute/Images.tsx` | Folded into new project detail |
| `src/components/TextBox/index.tsx` | Broken animation, unused |
| `src/interfaces/item-interface.tsx` | Dead code |
| `src/interfaces/skill-interface.tsx` | Dead code |
| `src/interfaces/attribute-interface.tsx` | Dead code |
| `src/interfaces/image-interface.tsx` | Dead code |
| `src/pages/about/index.tsx` | Unreachable route |
| `src/pages/projects/index.tsx` | Unused separate page |

### New files

| File | Purpose |
|------|---------|
| `src/components/GlassCard/index.tsx` | Reusable glass-morphism card |
| `src/components/SectionTitle/index.tsx` | Reusable section title with gradient underline |

---

## Visual Design System

### Glassmorphism pattern

All content containers use:
```
backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl shadow-xl
```

Hover states add subtle lift:
```
hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300
```

### Color palette

| Token | Tailwind | Usage |
|-------|----------|-------|
| `primary` | zinc | Backgrounds, text, neutral elements |
| `secondary` | rose | Accents, links, hover states, gradient |
| Removed: `off`, `warning`, `danger`, `success` | | Never used |

### Typography

- **Font:** Inter (via Google Fonts) — 400, 500, 600, 700 weights
- **Headings:** `font-semibold` / `font-bold`, dark: `text-primary-50`, light: `text-primary-900`
- **Body:** `font-normal`, dark: `text-primary-300`, light: `text-primary-700`
- **Small/caption:** `text-sm`, dark: `text-primary-400`, light: `text-primary-500`

### Spacing & layout

- Section padding: `py-24 px-4 sm:px-8`
- Section max-width: `max-w-6xl mx-auto`
- Section gap: `gap-16`
- Card padding: `p-6` (standard), `p-8` (large)

### Animations

- Page load: sections fade in on scroll via CSS only (`@keyframes fadeIn` + `animation-timeline: view()` or Intersection Observer alternatives)
- Card hover: `hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-300`
- Image hover: `group-hover:scale-105 transition-transform duration-300`
- Language switcher: smooth pill background transition

---

## Section Designs

### Hero

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                    Aldair Garros                      │
│     Fullstack Developer &                             │
│     Software Engineering Specialist                    │
│                                                      │
│              ┌──────────────────┐                     │
│              │ USP/ESALQ · 2026 │   (glass pill badge)│
│              └──────────────────┘                     │
│                                                      │
│  Full viewport height, centered text, gradient accent │
└──────────────────────────────────────────────────────┘
```

- Name in `text-5xl sm:text-7xl font-bold`
- Title in `text-xl sm:text-2xl text-primary-600 dark:text-primary-400`
- Badge: glass pill with rose accent border
- Background: subtle radial gradient from rose/10 at center

### Education (NEW)

```
┌──────────────────────────────────────────────────────┐
│  Education                                           │
│  ────────── (gradient underline)                     │
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │ 🎓  Software Engineering Specialist              ││
│  │     USP/ESALQ — 2024/2026                        ││
│  │                                                  ││
│  │     Postgraduate specialization in Software      ││
│  │     Engineering, culminating in a Design Thinking ││
│  │     capstone project: Atalaia Pro — a real-time   ││
│  │     SPA/PWA for maritime operations.              ││
│  └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

- Single glass card with large graduation-cap icon or "🎓" as visual anchor
- Institution + date on sub-line
- Description connects the education to the Atalaia Pro project

### Projects

```
┌──────────────────────────────────────────────────────┐
│  Projects                                            │
│  ──────────                                          │
│                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐           │
│  │  image   │  │  image   │  │  image   │           │
│  │          │  │          │  │          │           │
│  │  name    │  │  name    │  │  name    │           │
│  │  year    │  │  year    │  │  year    │           │
│  │  overview│  │  overview│  │  overview│           │
│  │  [open]  │  │  [open]  │  │  [open]  │           │
│  └──────────┘  └──────────┘  └──────────┘           │
│                                                      │
│  ┌──────────┐                                       │
│  │  image   │                                       │
│  │  name    │                                       │
│  │  year    │                                       │
│  │  overview│                                       │
│  │  [open]  │                                       │
│  └──────────┘                                       │
│                                                      │
│  2-column grid on md+, single column on mobile       │
└──────────────────────────────────────────────────────┘
```

- Each project as a glass card with image on top, content below
- Grid: `grid grid-cols-1 md:grid-cols-2 gap-8`
- Image: `rounded-xl` with rose-tinted overlay on hover
- "View project" link as a rose-colored text link with arrow

### Project Detail (`/projects/:project`)

```
┌──────────────────────────────────────────────────────┐
│  ← Back to home          Project Name     Date       │
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │  Description text in clean prose                 ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │  Details text                                    ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │  [Link to project (if exists)]                    ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│  │ img1 │ │ img2 │ │ img3 │ │ img4 │               │
│  └──────┘ └──────┘ └──────┘ └──────┘               │
│                                                      │
│  ── Other projects ──                                │
│  ┌──────────┐  ┌──────────┐                         │
│  │  card    │  │  card    │                         │
│  └──────────┘  └──────────┘                         │
└──────────────────────────────────────────────────────┘
```

- Back link at top
- All images shown (dynamic, not hardcoded to 3)
- External links use proper `<a>` tags
- "Other projects" section using the same ProjectCard components

### Expertise

```
┌──────────────────────────────────────────────────────┐
│  Expertise                                           │
│  ──────────                                          │
│                                                      │
│  Backend Development                                 │
│  ┌──────────────────────────────────────────────────┐│
│  │  [icon] [icon] [icon] [icon] [icon] [icon]       ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  Frontend Development                                │
│  ┌──────────────────────────────────────────────────┐│
│  │  [icon] [icon] [icon] [icon] [icon] [icon]       ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  General                                             │
│  ┌──────────────────────────────────────────────────┐│
│  │  [icon] [icon] [icon] [icon] [icon] [icon]       ││
│  └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

- Category title as `text-lg font-medium` with rose accent
- Skills as `flex flex-wrap gap-4` of `w-16 h-16` icon cards
- Each skill is a glass pill: `backdrop-blur-sm bg-white/10 border border-white/10 rounded-xl p-2`
- Label below icon, `text-xs text-center`
- Hover: `hover:scale-110 transition-transform`

### About (Work Experience)

```
┌──────────────────────────────────────────────────────┐
│  About                                               │
│  ──────────                                          │
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │ UI/UX Designer (Freelance)                        ││
│  │ 2023 — Present                                   ││
│  │                                                  ││
│  │ Planning and creation of digital products and    ││
│  │ services, focusing on user experience...          ││
│  │                                                  ││
│  │ Work: ...  Tools: ...  Achievements: ...         ││
│  └──────────────────────────────────────────────────┘│
│                                                      │
│  ┌──────────────────────────────────────────────────┐│
│  │ Full Stack Developer (Freelance)                  ││
│  │ 2022 — Present                                   ││
│  │                                                  ││
│  │ Development of responsive web projects...         ││
│  │                                                  ││
│  │ Work: ...  Tools: ...  Achievements: ...         ││
│  └──────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

- Each experience as a glass card
- Title + date as header row
- Description as lead paragraph
- Work, tools, achievements as separate paragraphs with label prefixes
- Cards separated by `gap-8`

### Contact

```
┌──────────────────────────────────────────────────────┐
│  Contact                                             │
│  ──────────                                          │
│                                                      │
│  ┌─────────────────────┐  ┌────────────────────────┐│
│  │ I'm open to new     │  │  [email]    pill link  ││
│  │ opportunities, so   │  │  [phone]    pill link  ││
│  │ feel free to        │  │  [whatsapp] pill link  ││
│  │ contact me.         │  │  [linkedin] pill link  ││
│  │                     │  │  [github]   pill link  ││
│  └─────────────────────┘  └────────────────────────┘│
└──────────────────────────────────────────────────────┘
```

- Glass card for the message on the left
- Contact links as properly formatted `<a>` tags with `target="_blank"` and `rel="noopener noreferrer"` for external links
- Links styled as pill buttons: `px-4 py-2 rounded-full border border-white/20 hover:bg-secondary-600 hover:text-white transition-colors`

### MenuBar

```
┌──────────────────────────────────────────────────────┐
│  AG   Home  Projects  Expertise  About  Contact  [EN│BR]│
└──────────────────────────────────────────────────────┘
```

- Logo: "AG" monogram (or name) on the left
- Nav links: `text-sm font-medium` with subtle underline on hover/active
- Language switcher: pill toggle with smooth background transition between EN/BR
- Mobile: hamburger icon → slide-in panel from right with overlay
- Glass effect: `backdrop-blur-md bg-white/70 dark:bg-primary-900/70`

### Sticker (desktop only)

```
┌──────────────────┐
│ info@aldairgc.com │
└──────────────────┘
  (fixed, bottom-left)
```

- Glass card with subtle fade-in
- `fixed bottom-8 left-8 hidden lg:block`

---

## Bug Fixes

1. **Contact links navigate within SPA** → Use `<a>` for external/mailto/tel links, react-router `<Link>` only for internal routes
2. **Mobile language switcher broken** → Call `i18n.changeLanguage()` on both mobile and desktop
3. **Hash navigation i18n conflict** → Use fixed English IDs for section anchors (not translated)
4. **`animate-blink` undefined** → Removed with TextBox; if needed, define keyframes in `globals.css`
5. **`dark:drop-shadow-light` invalid** → Replace with valid Tailwind utility or remove

## Content Fixes

6. **Portuguese accent errors** → Fix all: visão, descrição, comunicação, previsões, atualizações, instalação, redução, operação, geração
7. **Image limit bug** → Project detail page now renders all images dynamically, not capped at 3
8. **HTML lang attribute** → Update dynamically when language changes

## Cleanup Items

9. Remove all dead components and interfaces (list in Architecture section)
10. Remove unused color aliases from `globals.css`
11. Fix Layout gradient to use aliased colors
12. Remove `openToWork` from locale files
13. Remove `debug: true` from i18n, use `import.meta.env.DEV`
14. Add `focus:ring-2 focus:ring-secondary-500 focus:outline-none` to all interactive elements
15. Add `aria-label` to nav toggle and language switcher

---

## Locale Changes

### New keys needed

Under a new `education` top-level section in both `en.json` and `br.json`:

```json
"education": {
  "title": { "label": "title", "value": "Education" },
  "course": {
    "title": { "label": "course", "value": "Software Engineering Specialist" },
    "institution": { "label": "institution", "value": "USP/ESALQ" },
    "period": { "label": "period", "value": "2024 — 2026" },
    "description": { "label": "description", "value": "Postgraduate specialization in Software Engineering at the University of Sao Paulo (USP/ESALQ). The program covered software architecture, design patterns, agile methodologies, project management, and culminated in a Design Thinking capstone project: Atalaia Pro — a real-time SPA/PWA system developed for the Atalaia port authority that reduced maritime maneuver report preparation time by 82%." }
  }
}
```

### Removed keys

- `extra.openToWork`

### Modified keys

- `home.title` → becomes the full name or logo text
- All `projects.list.*.images.list` → ensure consistent image structures
- Hero subtitle already updated in previous commit

### Section anchor IDs

### Hash navigation IDs

Section `id` attributes use fixed English identifiers regardless of active language:
- `id="hero"`, `id="education"`, `id="projects"`, `id="expertise"`, `id="about"`, `id="contact"`

MenuBar links always point to `/#education`, `/#projects`, etc. — no localization in URL hashes.

### Project detail page back link

The "Back to home" link on `/projects/:project` navigates to `/` and scrolls to the projects section: `to="/#projects"`.
