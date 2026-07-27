# Expertise Section — Professional Capabilities Redesign

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3 category tech-badge grids (backend/frontend/general) with 5 professional capability cards showing context, applicability, impact narratives plus supplementary tech badges.

**Architecture:** Restructure `expertise.json` from `[{name, values[]}]` to `[{id, title, context, applicability, impact, tech[]}]`. Rewrite `Expertise` component to iterate capabilities into a 2-column GlassCard grid with inline label/value paragraphs (following About section pattern). Keep `Skill` component unchanged — it reads label/imageSrc from the translation tree under the capability id.

**Tech Stack:** React 19, TypeScript, Tailwind v4, i18next/react-i18next

## Global Constraints

- All user-facing strings in locale JSON files — no hardcoded text in components
- Follow About section's inline label/value pattern (no Attribute component needed)
- Skill component translation path unchanged: `list.${expertise}.list.${skill}.label` and `.imageSrc`
- Dark mode via `prefers-color-scheme` media query — use `dark:` variants for all text
- Use `@/` path alias for all imports
- `noUnusedLocals` and `noUnusedParameters` enabled — no unused imports
- TypeScript strict mode

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/assets/expertise.json` | Rewrite | Capability data: 5 entries with id, title, context, applicability, impact, tech[] |
| `src/modules/Expertise/index.tsx` | Rewrite | Component: 2-col grid of GlassCards with narrative + tech badges |
| `src/modules/Expertise/Skill.tsx` | Unchanged | Tech badge renderer (image + label from translations) |
| `src/locales/en.json` | Modify | Replace `expertise.list` with 5 capability entries + attribute labels |
| `src/locales/br.json` | Modify | Same structure, Brazilian Portuguese translations |

---

### Task 1: Add capability label translations

**Files:**
- Modify: `src/locales/en.json:253-380`
- Modify: `src/locales/br.json:253-380`

**Interfaces:**
- Produces: Translation keys `expertise.contextLabel`, `expertise.applicabilityLabel`, `expertise.impactLabel` + 5 capability entries under `expertise.list.<id>` with `title`, `context`, `applicability`, `impact` + nested `list.<techKey>` objects with `label` and `imageSrc`

- [ ] **Step 1: Replace the expertise section in en.json**

Read the current `expertise` block in `src/locales/en.json` (lines 253–380) and replace it entirely with:

```json
"expertise": {
  "title": "expertise",
  "contextLabel": "context",
  "applicabilityLabel": "applicability",
  "impactLabel": "impact",
  "list": {
    "api-backend": {
      "title": "API & Backend Systems",
      "context": "Designing and implementing reliable server-side architectures — REST APIs, database modeling, authentication systems, and observability pipelines.",
      "applicability": "Applied across 4 backend projects: Fastify 5 APIs with Drizzle ORM on PostgreSQL (Atalaia Pro — 80+ endpoints, role-based auth with 6 user groups), Koa 2 with raw SQL and Firebase OAuth (Music Market — 19 tables, 80+ endpoints), Express with Sequelize on MariaDB (Budget), and a Fastify podcast API with full Zod schema validation and auto-generated Swagger docs.",
      "impact": "Delivered production APIs handling authentication, soft deletes, pagination, filtering, and multi-tenant operations. All projects include CI/CD pipelines, Docker Compose orchestration, and observability via OpenTelemetry and Sentry.",
      "list": {
        "node": { "label": "Node", "imageSrc": "nodejs.png" },
        "express": { "label": "Express", "imageSrc": "expressjs.png" },
        "fastify": { "label": "Fastify", "imageSrc": "fastify.png" },
        "prisma": { "label": "Prisma", "imageSrc": "prisma.png" },
        "sql": { "label": "SQL", "imageSrc": "postgres.png" },
        "mongodb": { "label": "MongoDB", "imageSrc": "mongodb.png" },
        "rest": { "label": "REST", "imageSrc": "restapi.png" },
        "jwt": { "label": "JWT", "imageSrc": "jwt.png" }
      }
    },
    "frontend-engineering": {
      "title": "Modern Frontend Engineering",
      "context": "Building performant, accessible, and visually refined single-page applications using component-driven architecture, type-safe development, and modern tooling.",
      "applicability": "Leveraged across 4 frontend projects: a React 19 PWA with offline IndexedDB cache, TypeScript 6, Zustand, and TanStack Query/Table (Atalaia Pro — 12 pages, 60+ components, dual router trees for auth); a Next.js 16 app with Prisma 7 and full audit trail (Penhor — 14 pages, 24 DB tables); a React 18 admin dashboard with Zustand and Tailwind 3 (Music Market — 12 routes); and this bilingual portfolio with i18next and code-as-UI aesthetic.",
      "impact": "Delivered PWAs with offline support, role-based UI filtering, drag-and-drop UX, and consistent design systems. Established reusable component libraries, type-safe API contracts, and automated CI/CD builds across projects.",
      "list": {
        "react": { "label": "React", "imageSrc": "react.png" },
        "nextjs": { "label": "Next.js", "imageSrc": "nextjs.png" },
        "typescript": { "label": "TypeScript", "imageSrc": "ts.png" },
        "tailwind": { "label": "TailwindCSS", "imageSrc": "tailwind.png" },
        "redux": { "label": "Redux", "imageSrc": "redux.png" },
        "vite": { "label": "Vite", "imageSrc": "vite.png" },
        "html": { "label": "HTML", "imageSrc": "html5.png" },
        "css": { "label": "CSS", "imageSrc": "css3.png" },
        "javascript": { "label": "JavaScript", "imageSrc": "js.png" }
      }
    },
    "mobile": {
      "title": "Mobile Development",
      "context": "Creating cross-platform native mobile applications for Android and iOS using React Native with shared TypeScript business logic.",
      "applicability": "Delivered 3 mobile applications from scratch: a personal finance app (Bolso Bom) with React Native, PostgreSQL backend, and JWT authentication; the Music Market community marketplace app connecting musicians and producers; and a social podcast app with chat rooms, media management, and user group permissions.",
      "impact": "Shipped fully functional native apps with cross-platform TypeScript code reuse, secure authentication, push notifications, and REST API integration. Managed the full development lifecycle from UI/UX design through backend architecture and deployment.",
      "list": {
        "reactNative": { "label": "React Native", "imageSrc": "react.png" },
        "typescript": { "label": "TypeScript", "imageSrc": "ts.png" },
        "jest": { "label": "Jest", "imageSrc": "jest.png" },
        "solid": { "label": "SOLID", "imageSrc": "solid.png" },
        "designPatterns": { "label": "Design Patterns", "imageSrc": "design-patterns.png" }
      }
    },
    "devops": {
      "title": "DevOps & Infrastructure",
      "context": "Managing self-hosted production infrastructure on VPS environments — container orchestration, observability stacks, CI/CD pipelines, and automated deployments.",
      "applicability": "Designed and maintain a complete LGTM observability platform (Loki, Grafana, Tempo, Prometheus) with 9 containerized services on rootless Podman, 14 alert rules, 8 provisioned dashboards, and SLO-based alerting at 99.5% availability. All 6 production projects run Docker/Podman Compose with GitHub Actions CI/CD, SSH-based deploys, Nginx reverse proxies, and PostgreSQL exporter monitoring.",
      "impact": "Established a self-healing infrastructure with automatic deploy rollbacks, Telegram + email alert routing, multi-window error budget tracking, and 30-day log/metric retention. Enabled full-stack observability — logs, metrics, and distributed traces — across all deployed applications from a single VPS.",
      "list": {
        "docker": { "label": "Docker", "imageSrc": "docker.png" },
        "nginx": { "label": "Nginx", "imageSrc": "nginx.png" },
        "apache": { "label": "Apache", "imageSrc": "apache.png" },
        "git": { "label": "Git", "imageSrc": "git.png" },
        "strapi": { "label": "Strapi", "imageSrc": "strapi.png" }
      }
    },
    "ux-strategy": {
      "title": "UX Strategy & Design",
      "context": "Applying user-centered design methodology from discovery research through high-fidelity prototyping — blending analytical rigor with creative problem-solving.",
      "applicability": "Led 3 complete freelance UI/UX design projects using the Spiral UX UI Continuous methodology (a Double Diamond abstraction). Conducted user interviews, competitor analysis, proto-personas, journey mapping, CSD matrices, wireframes, usability testing, and delivered high-fidelity prototypes in Figma. Applied this design foundation across all development projects.",
      "impact": "Received consistently positive client feedback for simplified approaches, attention to detail, and actionable research insights. The design methodology now informs all development work — every project begins with user-centered analysis before a single line of code.",
      "list": {
        "ui": { "label": "UI Design", "imageSrc": "design.png" },
        "ux": { "label": "UX Research", "imageSrc": "insight.png" }
      }
    }
  }
}
```

- [ ] **Step 2: Replace the expertise section in br.json**

Read the current `expertise` block in `src/locales/br.json` (lines 253–380) and replace it entirely with:

```json
"expertise": {
  "title": "competências",
  "contextLabel": "contexto",
  "applicabilityLabel": "aplicabilidade",
  "impactLabel": "impacto",
  "list": {
    "api-backend": {
      "title": "API & Sistemas Backend",
      "context": "Projeto e implementação de arquiteturas server-side confiáveis — APIs REST, modelagem de banco de dados, sistemas de autenticação e pipelines de observabilidade.",
      "applicability": "Aplicado em 4 projetos backend: APIs Fastify 5 com Drizzle ORM em PostgreSQL (Atalaia Pro — 80+ endpoints, autenticação com 6 grupos de usuários), Koa 2 com SQL puro e OAuth Firebase (Music Market — 19 tabelas, 80+ endpoints), Express com Sequelize em MariaDB (Budget) e uma API podcast com Fastify, validação Zod completa e documentação Swagger auto-gerada.",
      "impact": "Entreguei APIs em produção com autenticação, soft deletes, paginação, filtros e operações multi-tenant. Todos os projetos incluem pipelines CI/CD, orquestração com Docker Compose e observabilidade via OpenTelemetry e Sentry.",
      "list": {
        "node": { "label": "Node", "imageSrc": "nodejs.png" },
        "express": { "label": "Express", "imageSrc": "expressjs.png" },
        "fastify": { "label": "Fastify", "imageSrc": "fastify.png" },
        "prisma": { "label": "Prisma", "imageSrc": "prisma.png" },
        "sql": { "label": "SQL", "imageSrc": "postgres.png" },
        "mongodb": { "label": "MongoDB", "imageSrc": "mongodb.png" },
        "rest": { "label": "REST", "imageSrc": "restapi.png" },
        "jwt": { "label": "JWT", "imageSrc": "jwt.png" }
      }
    },
    "frontend-engineering": {
      "title": "Engenharia Frontend Moderna",
      "context": "Construção de single-page applications performáticas, acessíveis e visualmente refinadas usando arquitetura orientada a componentes, desenvolvimento type-safe e ferramental moderno.",
      "applicability": "Aplicado em 4 projetos frontend: um PWA React 19 com cache offline IndexedDB, TypeScript 6, Zustand e TanStack Query/Table (Atalaia Pro — 12 páginas, 60+ componentes, árvores de rotas duplas para autenticação); um app Next.js 16 com Prisma 7 e trilha de auditoria completa (Penhor — 14 páginas, 24 tabelas); um dashboard admin React 18 com Zustand e Tailwind 3 (Music Market — 12 rotas); e este portfólio bilíngue com i18next e estética code-as-UI.",
      "impact": "Entreguei PWAs com suporte offline, filtragem de UI por permissões, UX com drag-and-drop e sistemas de design consistentes. Estabeleci bibliotecas de componentes reutilizáveis, contratos de API type-safe e builds CI/CD automatizados em todos os projetos.",
      "list": {
        "react": { "label": "React", "imageSrc": "react.png" },
        "nextjs": { "label": "Next.js", "imageSrc": "nextjs.png" },
        "typescript": { "label": "TypeScript", "imageSrc": "ts.png" },
        "tailwind": { "label": "TailwindCSS", "imageSrc": "tailwind.png" },
        "redux": { "label": "Redux", "imageSrc": "redux.png" },
        "vite": { "label": "Vite", "imageSrc": "vite.png" },
        "html": { "label": "HTML", "imageSrc": "html5.png" },
        "css": { "label": "CSS", "imageSrc": "css3.png" },
        "javascript": { "label": "JavaScript", "imageSrc": "js.png" }
      }
    },
    "mobile": {
      "title": "Desenvolvimento Mobile",
      "context": "Criação de aplicativos móveis nativos multiplataforma para Android e iOS usando React Native com lógica de negócio compartilhada em TypeScript.",
      "applicability": "Entreguei 3 aplicativos móveis do zero: um app de finanças pessoais (Bolso Bom) com React Native, backend PostgreSQL e autenticação JWT; o app Music Market conectando músicos e produtores em um marketplace comunitário; e um app social de podcast com salas de chat, gestão de mídia e permissões por grupos de usuários.",
      "impact": "Publiquei apps nativos totalmente funcionais com reuso de código TypeScript entre plataformas, autenticação segura, notificações push e integração com APIs REST. Gerenciei o ciclo completo de desenvolvimento, do design UI/UX à arquitetura backend e deploy.",
      "list": {
        "reactNative": { "label": "React Native", "imageSrc": "react.png" },
        "typescript": { "label": "TypeScript", "imageSrc": "ts.png" },
        "jest": { "label": "Jest", "imageSrc": "jest.png" },
        "solid": { "label": "SOLID", "imageSrc": "solid.png" },
        "designPatterns": { "label": "Design Patterns", "imageSrc": "design-patterns.png" }
      }
    },
    "devops": {
      "title": "DevOps & Infraestrutura",
      "context": "Gestão de infraestrutura auto-hospedada em VPS — orquestração de contêineres, stacks de observabilidade, pipelines CI/CD e deploys automatizados.",
      "applicability": "Projetei e mantenho uma plataforma completa de observabilidade LGTM (Loki, Grafana, Tempo, Prometheus) com 9 serviços conteinerizados em Podman rootless, 14 regras de alerta, 8 dashboards provisionados e alertas baseados em SLO com 99,5% de disponibilidade. Todos os 6 projetos em produção utilizam Docker/Podman Compose com GitHub Actions CI/CD, deploys via SSH, proxies reversos Nginx e monitoramento com PostgreSQL exporter.",
      "impact": "Estabeleci uma infraestrutura com auto-recuperação usando rollbacks automáticos, roteamento de alertas Telegram + email, rastreamento de orçamento de erro multi-janela e retenção de 30 dias de logs/métricas. Possibilitei observabilidade full-stack — logs, métricas e traces distribuídos — em todas as aplicações a partir de um único VPS.",
      "list": {
        "docker": { "label": "Docker", "imageSrc": "docker.png" },
        "nginx": { "label": "Nginx", "imageSrc": "nginx.png" },
        "apache": { "label": "Apache", "imageSrc": "apache.png" },
        "git": { "label": "Git", "imageSrc": "git.png" },
        "strapi": { "label": "Strapi", "imageSrc": "strapi.png" }
      }
    },
    "ux-strategy": {
      "title": "UX Strategy & Design",
      "context": "Aplicação de metodologia de design centrado no usuário, da pesquisa de descoberta à prototipação de alta fidelidade — unindo rigor analítico e resolução criativa de problemas.",
      "applicability": "Liderei 3 projetos freelance completos de UI/UX usando a metodologia Spiral UX UI Continuous (uma abstração do Duplo Diamante). Conduzi entrevistas com usuários, análise competitiva, proto-personas, mapeamento de jornada, matrizes CSD, wireframes, testes de usabilidade e entreguei protótipos de alta fidelidade no Figma. Apliquei essa base de design em todos os projetos de desenvolvimento.",
      "impact": "Recebi feedback consistentemente positivo dos clientes pela abordagem simplificada, atenção aos detalhes e insights de pesquisa acionáveis. A metodologia de design agora orienta todo o trabalho de desenvolvimento — cada projeto começa com análise centrada no usuário antes da primeira linha de código.",
      "list": {
        "ui": { "label": "UI Design", "imageSrc": "design.png" },
        "ux": { "label": "UX Research", "imageSrc": "insight.png" }
      }
    }
  }
}
```

- [ ] **Step 3: Verify JSON is valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/locales/en.json','utf8'))" \
  && echo "EN valid" \
  && node -e "JSON.parse(require('fs').readFileSync('src/locales/br.json','utf8'))" \
  && echo "BR valid"
```

Expected: `EN valid` and `BR valid` printed.

- [ ] **Step 4: Commit**

```bash
git add src/locales/en.json src/locales/br.json
git commit -m "feat: add 5 capability translations for expertise section"
```

---

### Task 2: Restructure expertise.json with capability data

**Files:**
- Modify: `src/assets/expertise.json`

**Interfaces:**
- Produces: Array of `{id: string, title: string, context: string, applicability: string, impact: string, tech: string[]}`

- [ ] **Step 1: Replace the file content**

Replace `src/assets/expertise.json` entirely with:

```json
[
  {
    "id": "api-backend",
    "title": "API & Backend Systems",
    "context": "Designing and implementing reliable server-side architectures — REST APIs, database modeling, authentication systems, and observability pipelines.",
    "applicability": "Applied across 4 backend projects: Fastify 5 APIs with Drizzle ORM on PostgreSQL (Atalaia Pro — 80+ endpoints, role-based auth with 6 user groups), Koa 2 with raw SQL and Firebase OAuth (Music Market — 19 tables, 80+ endpoints), Express with Sequelize on MariaDB (Budget), and a Fastify podcast API with full Zod schema validation and auto-generated Swagger docs.",
    "impact": "Delivered production APIs handling authentication, soft deletes, pagination, filtering, and multi-tenant operations. All projects include CI/CD pipelines, Docker Compose orchestration, and observability via OpenTelemetry and Sentry.",
    "tech": ["node", "express", "fastify", "prisma", "sql", "mongodb", "rest", "jwt"]
  },
  {
    "id": "frontend-engineering",
    "title": "Modern Frontend Engineering",
    "context": "Building performant, accessible, and visually refined single-page applications using component-driven architecture, type-safe development, and modern tooling.",
    "applicability": "Leveraged across 4 frontend projects: a React 19 PWA with offline IndexedDB cache, TypeScript 6, Zustand, and TanStack Query/Table (Atalaia Pro — 12 pages, 60+ components, dual router trees for auth); a Next.js 16 app with Prisma 7 and full audit trail (Penhor — 14 pages, 24 DB tables); a React 18 admin dashboard with Zustand and Tailwind 3 (Music Market — 12 routes); and this bilingual portfolio with i18next and code-as-UI aesthetic.",
    "impact": "Delivered PWAs with offline support, role-based UI filtering, drag-and-drop UX, and consistent design systems. Established reusable component libraries, type-safe API contracts, and automated CI/CD builds across projects.",
    "tech": ["react", "nextjs", "typescript", "tailwind", "redux", "vite", "html", "css", "javascript"]
  },
  {
    "id": "mobile",
    "title": "Mobile Development",
    "context": "Creating cross-platform native mobile applications for Android and iOS using React Native with shared TypeScript business logic.",
    "applicability": "Delivered 3 mobile applications from scratch: a personal finance app (Bolso Bom) with React Native, PostgreSQL backend, and JWT authentication; the Music Market community marketplace app connecting musicians and producers; and a social podcast app with chat rooms, media management, and user group permissions.",
    "impact": "Shipped fully functional native apps with cross-platform TypeScript code reuse, secure authentication, push notifications, and REST API integration. Managed the full development lifecycle from UI/UX design through backend architecture and deployment.",
    "tech": ["reactNative", "typescript", "jest", "solid", "designPatterns"]
  },
  {
    "id": "devops",
    "title": "DevOps & Infrastructure",
    "context": "Managing self-hosted production infrastructure on VPS environments — container orchestration, observability stacks, CI/CD pipelines, and automated deployments.",
    "applicability": "Designed and maintain a complete LGTM observability platform (Loki, Grafana, Tempo, Prometheus) with 9 containerized services on rootless Podman, 14 alert rules, 8 provisioned dashboards, and SLO-based alerting at 99.5% availability. All 6 production projects run Docker/Podman Compose with GitHub Actions CI/CD, SSH-based deploys, Nginx reverse proxies, and PostgreSQL exporter monitoring.",
    "impact": "Established a self-healing infrastructure with automatic deploy rollbacks, Telegram + email alert routing, multi-window error budget tracking, and 30-day log/metric retention. Enabled full-stack observability — logs, metrics, and distributed traces — across all deployed applications from a single VPS.",
    "tech": ["docker", "nginx", "apache", "git", "strapi"]
  },
  {
    "id": "ux-strategy",
    "title": "UX Strategy & Design",
    "context": "Applying user-centered design methodology from discovery research through high-fidelity prototyping — blending analytical rigor with creative problem-solving.",
    "applicability": "Led 3 complete freelance UI/UX design projects using the Spiral UX UI Continuous methodology (a Double Diamond abstraction). Conducted user interviews, competitor analysis, proto-personas, journey mapping, CSD matrices, wireframes, usability testing, and delivered high-fidelity prototypes in Figma. Applied this design foundation across all development projects.",
    "impact": "Received consistently positive client feedback for simplified approaches, attention to detail, and actionable research insights. The design methodology now informs all development work — every project begins with user-centered analysis before a single line of code.",
    "tech": ["ui", "ux"]
  }
]
```

- [ ] **Step 3: Commit**

```bash
git add src/assets/expertise.json
git commit -m "feat: restructure expertise.json with 5 capability entries"
```

---

### Task 3: Add fastify skill image

**Files:**
- Need: `public/skill_images/fastify.png`

**Interfaces:**
- Produces: `public/skill_images/fastify.png` — 40×40px PNG icon for the Fastify tech badge

- [ ] **Step 1: Check if fastify image exists**

```bash
ls public/skill_images/fastify.png 2>/dev/null && echo "exists" || echo "missing"
```

If missing, download a Fastify icon. Use curl to fetch from a reliable CDN:

```bash
curl -L -o public/skill_images/fastify.png \
  "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastify/fastify-original.svg" \
  2>/dev/null || \
curl -L -o public/skill_images/fastify.png \
  "https://raw.githubusercontent.com/devicons/devicon/master/icons/fastify/fastify-original.svg" \
  2>/dev/null
```

Note: SVG may not render correctly in an `<img>` tag with `src` at 40×40. If the download is SVG format, convert to PNG:

```bash
# Option: use rsvg-convert if available, otherwise skip and SVG works
which rsvg-convert && rsvg-convert -w 40 -h 40 -o public/skill_images/fastify.png public/skill_images/fastify.png 2>/dev/null || echo "SVG format — will test rendering"
```

If all download/conversion fails, proceed without — the translation JSON still expects `fastify.png`. Test in Task 4 to confirm rendering.

- [ ] **Step 2: Commit (if file created)**

```bash
git add public/skill_images/fastify.png && git commit -m "feat: add fastify skill image"
```

Or skip if the image wasn't created.

---

### Task 4: Rewrite Expertise component

**Files:**
- Modify: `src/modules/Expertise/index.tsx`

**Interfaces:**
- Consumes: `expertise` array from `@/assets/expertise.json` (Task 2), translation keys from `expertise.*` namespace (Task 1), `Skill` component (existing, unchanged)
- Produces: Exported `Expertise` component rendering a 2-col grid of GlassCards

- [ ] **Step 1: Replace the component file**

Replace the contents of `src/modules/Expertise/index.tsx` with:

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {expertise.map((capability, index) => {
          const isLastOdd =
            index === expertise.length - 1 && expertise.length % 2 !== 0;

          return (
            <GlassCard
              key={capability.id}
              hover
              className={`p-8 ${isLastOdd ? "md:col-span-2" : ""}`}>
              <h3 className="text-xl font-semibold text-primary-900 dark:text-primary-50 mb-4">
                {t(`list.${capability.id}.title`)}
              </h3>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-medium text-primary-900 dark:text-primary-50">
                    {t("contextLabel")}:
                  </span>{" "}
                  <span className="text-primary-600 dark:text-primary-400">
                    {t(`list.${capability.id}.context`)}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-primary-900 dark:text-primary-50">
                    {t("applicabilityLabel")}:
                  </span>{" "}
                  <span className="text-primary-600 dark:text-primary-400">
                    {t(`list.${capability.id}.applicability`)}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-primary-900 dark:text-primary-50">
                    {t("impactLabel")}:
                  </span>{" "}
                  <span className="text-primary-600 dark:text-primary-400">
                    {t(`list.${capability.id}.impact`)}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {capability.tech.map((tech) => (
                  <Skill key={tech} expertise={capability.id} skill={tech} />
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc -b --noEmit 2>&1 | head -20
```

Expected: No errors related to `Expertise` component (may see pre-existing errors in other files).

- [ ] **Step 3: Verify lint passes**

```bash
npm run lint 2>&1 | tail -5
```

Expected: No new errors from the `Expertise` module.

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev -- --host 0.0.0.0 &
sleep 3
curl -s http://localhost:5173 | head -5
kill %1 2>/dev/null
```

Expected: Vite dev server starts without errors and returns HTML.

- [ ] **Step 5: Commit**

```bash
git add src/modules/Expertise/index.tsx
git commit -m "feat: rewrite Expertise section with 5 capability narrative cards"
```

---

### Task 5: Build verification

**Files:**
- No new files — verifies all changes work together

- [ ] **Step 1: Run full build (typecheck + vite build)**

```bash
npm run build 2>&1
```

Expected: Build succeeds with no errors. The `tsc -b` typechecker runs first, then `vite build` produces output.

- [ ] **Step 2: Preview the production build**

```bash
npm run preview -- --host 0.0.0.0 &
sleep 3
curl -s http://localhost:4173 | head -20
kill %1 2>/dev/null
```

Expected: Production preview serves the app with all translations and capability cards rendering correctly.

- [ ] **Step 3: Final commit if any build fixes were needed**

```bash
git status
```

If clean, no action needed. If build required fixes, commit them.
