# Portfolio Containerization & Observability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Containerize the portfolio SPA (Nginx container + metrics exporter sidecar on the VPS `monitoring` network) and instrument the React app with OpenTelemetry RUM (traces + web vitals → Tempo) and GlitchTip error tracking.

**Architecture:** Multi-stage Dockerfile (node:23-alpine build → nginx:1.27-alpine serve) produces a GHCR image deployed via podman-compose to the VPS, joining the external `monitoring` network alongside the existing vps-infrastructure stack. Host Nginx keeps TLS termination and reverse-proxies `/` → portfolio container, `/v1/traces` → Tempo, `/glitchtip/` → GlitchTip. Browser OTel JS exports traces via OTLP HTTP; web vitals export as spans so Tempo's metrics-generator derives RED metrics to Prometheus; `@sentry/react` sends errors to GlitchTip with OTel trace context injected.

**Tech Stack:** Docker, podman-compose, Nginx, OpenTelemetry JS (web), @sentry/react, GitHub Actions, GHCR.

## Global Constraints

- **No test suite exists** in this repo (AGENTS.md). Verification = `npm run lint`, `npm run typecheck`, `npm run build` (type errors fail build), plus manual dev-server checks where noted.
- Node **23** for CI (`actions/setup-node`) and Docker builder stage (`node:23-alpine`) — matches existing workflow.
- Install with `npm ci --legacy-peer-deps --no-audit --no-fund`.
- App port **3070** (user-specified); exporter host port **3071** (avoids host 9113 collision).
- Image registry: `ghcr.io/aldairgarros/portfolio`, tagged `$GITHUB_SHA` + `latest`.
- Compose network `monitoring` is **external**; log driver `k8s-file` (Promtail requirement).
- Path alias `@/` → `src/` for imports; TypeScript strict (`noUnusedLocals`/`noUnusedParameters` — no unused imports).
- React 19: use `React.JSX.Element` for explicit return types; JSX namespace is not global.
- eslint react-refresh rule `only-export-components`: component files must export only components — keep non-component exports in separate files.
- No hardcoded user-facing strings; these files are infra only.
- All new registry images pinned to exact tags.

---

### Task 1: Install Observability Dependencies

**Files:**

- Modify: `package.json`, `package-lock.json` (via npm)

**Interfaces:**

- Produces: packages consumed by Tasks 2, 3, 4.

- [ ] **Step 1: Install packages**

```bash
npm install @opentelemetry/api @opentelemetry/context-zone @opentelemetry/instrumentation @opentelemetry/sdk-trace-base @opentelemetry/sdk-trace-web @opentelemetry/auto-instrumentations-web @opentelemetry/exporter-trace-otlp-http @sentry/react
```

Expected: packages added to `dependencies` in `package.json`.

- [ ] **Step 2: Verify build + lint still pass**

```bash
npm run build && npm run lint
```

Expected: both exit 0. (Build includes `tsc -b` typecheck.)

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add OpenTelemetry and Sentry observability dependencies"
```

---

### Task 2: OpenTelemetry Browser Setup

**Files:**

- Create: `src/observability/otel.ts`

**Interfaces:**

- Consumes: packages from Task 1.
- Produces: `initOpenTelemetry(): void` — called by Task 4 in `src/main.tsx` before React renders. Reads no env vars; prod/console behavior switches on `import.meta.env.DEV`.

- [ ] **Step 1: Write `src/observability/otel.ts`**

```ts
import { Span } from "@opentelemetry/api";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { LongTaskInstrumentation } from "@opentelemetry/instrumentation-long-task";
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { initWebVitalsSpans } from "./web-vitals.ts";

const SESSION_ID = crypto.randomUUID();

class SessionIdSpanProcessor implements SpanProcessor {
  onStart(span: Span): void {
    span.setAttribute("session.id", SESSION_ID);
  }

  onEnd(): void {}

  forceFlush(): Promise<void> {
    return Promise.resolve();
  }

  shutdown(): Promise<void> {
    return Promise.resolve();
  }
}

export function initOpenTelemetry(): void {
  const spanProcessors: SpanProcessor[] = [new SessionIdSpanProcessor()];

  if (import.meta.env.DEV) {
    spanProcessors.push(new BatchSpanProcessor(new ConsoleSpanExporter()));
  } else {
    spanProcessors.push(
      new BatchSpanProcessor(new OTLPTraceExporter({ url: "https://aldairgarros.com/v1/traces" })),
    );
  }

  const provider = new WebTracerProvider({ spanProcessors });

  provider.register({ contextManager: new ZoneContextManager() });

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [getWebAutoInstrumentations(), new LongTaskInstrumentation()],
  });

  initWebVitalsSpans();
}
```

**v2 API note:** Installed OTel is the v2 release train (`sdk-trace-web@2.x`). Span processors go in the constructor (`spanProcessors` array, order preserved by MultiSpanProcessor), NOT `addSpanProcessor`. `getWebAutoInstrumentations()` needs no config — web-vitals and long-task instrumentations were removed from the meta package; long-task is added separately and web vitals are reported manually (see Step 2a below).

Notes:

- `SessionIdSpanProcessor` must be first in the array so its `onStart` runs before the batch processor exports.
- Dev mode uses the console exporter only — no traffic to production Tempo.

- [ ] **Step 1a: Create `src/observability/web-vitals.ts`**

Web-vitals instrumentation no longer exists in the OTel meta package (v2). Report each Core Web Vital as a span manually using Google's `web-vitals` package — Tempo's metrics-generator derives Prometheus metrics from these spans.

```ts
import { trace } from "@opentelemetry/api";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import type { Metric } from "web-vitals";

function reportWebVital(metric: Metric): void {
  const span = trace.getTracer("portfolio").startSpan(`web-vitals.${metric.name.toLowerCase()}`);

  span.setAttribute("web_vitals.rating", metric.rating);
  span.setAttribute("web_vitals.value", metric.value);
  span.setAttribute("web_vitals.delta", metric.delta);
  span.setAttribute("web_vitals.navigation_type", metric.navigationType);
  span.end();
}

export function initWebVitalsSpans(): void {
  onCLS(reportWebVital);
  onFCP(reportWebVital);
  onINP(reportWebVital);
  onLCP(reportWebVital);
  onTTFB(reportWebVital);
}
```

- [ ] **Step 1b: Install the two extra packages**

```bash
npm install web-vitals @opentelemetry/instrumentation-long-task
```

- [ ] **Step 2: Verify typecheck + lint**

```bash
npm run typecheck && npm run lint
```

Expected: both exit 0.

- [ ] **Step 3: Manual dev check**

```bash
npm run dev
```

Expected: console shows document-load and fetch spans from the console exporter when navigating the site. (Requires viewing in a browser.) Then stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/observability/otel.ts
git commit -m "feat: add OpenTelemetry browser RUM setup"
```

---

### Task 3: GlitchTip Error Tracking

**Files:**

- Create: `src/observability/glitchtip.ts`
- Create: `src/observability/ErrorBoundary.tsx`

**Interfaces:**

- Consumes: `@sentry/react` from Task 1; `@opentelemetry/api` (transitive) for trace context.
- Produces: `initGlitchTip(): void` and `GlitchTipErrorBoundary({ children }: { children: React.ReactNode }): React.JSX.Element` — consumed by Task 4.
- Reads `import.meta.env.VITE_SENTRY_DSN` (DSN string, injected at build time; empty/undefined disables error tracking).

- [ ] **Step 1: Write `src/observability/glitchtip.ts`**

```ts
import { context, trace } from "@opentelemetry/api";
import * as Sentry from "@sentry/react";

export function initGlitchTip(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;

  if (!dsn) {
    console.warn("[observability] VITE_SENTRY_DSN not set — error tracking disabled");
    return;
  }

  Sentry.init({
    dsn,
    tracesSampleRate: 0,
    beforeSend(event) {
      const spanContext = trace.getSpan(context.active())?.spanContext();

      if (spanContext) {
        event.tags = {
          ...event.tags,
          trace_id: spanContext.traceId,
          span_id: spanContext.spanId,
        };
      }

      return event;
    },
  });
}
```

- [ ] **Step 2: Write `src/observability/ErrorBoundary.tsx`**

```tsx
import type { ReactNode } from "react";
import * as Sentry from "@sentry/react";

export function GlitchTipErrorBoundary({ children }: { children: ReactNode }): React.JSX.Element {
  return <Sentry.ErrorBoundary fallback={undefined}>{children}</Sentry.ErrorBoundary>;
}
```

Note: kept in its own file — the eslint react-refresh rule requires component-only exports per file. `fallback={undefined}` satisfies `@sentry/react` v10's type (`ReactElement | FallbackRender | undefined`); Sentry renders `null` on error when no valid fallback exists, preserving the "render nothing" behavior.

- [ ] **Step 3: Verify typecheck + lint**

```bash
npm run typecheck && npm run lint
```

Expected: both exit 0. If eslint reports `VITE_SENTRY_DSN` type issues, the `as string | undefined` cast is already in place; do not add env typing files.

- [ ] **Step 4: Commit**

```bash
git add src/observability/glitchtip.ts src/observability/ErrorBoundary.tsx
git commit -m "feat: add GlitchTip error tracking with OTel trace correlation"
```

---

### Task 4: Wire Instrumentation into App Entry

**Files:**

- Modify: `src/main.tsx`

**Interfaces:**

- Consumes: `initOpenTelemetry()` (Task 2), `initGlitchTip()` + `GlitchTipErrorBoundary` (Task 3).
- Produces: instrumented app entry.

- [ ] **Step 1: Modify `src/main.tsx`**

Current file content (7 lines of imports + render):

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";
import "./i18n.ts";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/600.css";
import { GlitchTipErrorBoundary } from "./observability/ErrorBoundary.tsx";
import { initGlitchTip } from "./observability/glitchtip.ts";
import { initOpenTelemetry } from "./observability/otel.ts";

initOpenTelemetry();
initGlitchTip();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlitchTipErrorBoundary>
      <App />
    </GlitchTipErrorBoundary>
  </StrictMode>,
);
```

Order matters: OTel starts collecting **before** the app renders so the page-load trace covers the full document load.

- [ ] **Step 2: Verify build + lint**

```bash
npm run build && npm run lint
```

Expected: both exit 0.

- [ ] **Step 3: Manual dev smoke test**

```bash
npm run dev
```

Expected: page renders normally; console shows OTel spans (Task 2 behavior) and the GlitchTip init warning only if `VITE_SENTRY_DSN` is unset. Then stop the server.

- [ ] **Step 4: Commit**

```bash
git add src/main.tsx
git commit -m "feat: initialize observability before app render"
```

---

### Task 5: Dockerfile + Nginx Config + .dockerignore

**Files:**

- Create: `Dockerfile`
- Create: `nginx.conf`
- Create: `.dockerignore`

**Interfaces:**

- Produces: `Dockerfile` (builds `dist/` and serves it on port 3070), `nginx.conf` (SPA fallback, cache headers, stub_status), `.dockerignore`. Consumed by Task 6 (compose) and Task 7 (CI build).
- `VITE_SENTRY_DSN` build-arg: `ARG VITE_SENTRY_DSN` + `ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN` in the builder stage so Vite inlines it at build time.

- [ ] **Step 1: Write `Dockerfile`**

```dockerfile
# Stage 1: Build
FROM node:23-alpine AS builder
WORKDIR /app

ARG VITE_SENTRY_DSN
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --no-audit --no-fund

COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3070
```

- [ ] **Step 2: Write `nginx.conf`**

```nginx
server {
    listen 3070;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Metrics endpoint: exporter sidecar connects over the podman
    # network (10.0.0.0/8); host-local checks (curl, health probes)
    # connect from loopback — allow both, deny everything else.
    location /stub_status {
        stub_status;
        access_log off;
        allow 10.0.0.0/8;
        allow 127.0.0.1;
        deny all;
    }
}
```

Note: the portfolio port already binds `127.0.0.1` on the host, so stub_status is only reachable by host-local processes and the exporter container — this is defense in depth.

- [ ] **Step 3: Write `.dockerignore`**

```
node_modules
dist
.git
.github
docs
.opencode
.superpowers
*.tsbuildinfo
*.md
*.local
```

- [ ] **Step 4: Verify the build locally**

```bash
docker build -t portfolio:test .
```

Expected: image builds to completion, final stage is `nginx:1.27-alpine` with `dist/` copied.

- [ ] **Step 5: Verify container serves the site**

```bash
docker run --rm -p 3070:3070 portfolio:test
```

Expected: `curl -s http://localhost:3070/` returns the portfolio HTML; `curl -s http://localhost:3070/stub_status` returns nginx metrics (connection may come from host loopback — the allow rule covers it); `curl -s http://localhost:3070/nonexistent` returns the SPA fallback `index.html`. Stop the container afterward.

- [ ] **Step 6: Commit**

```bash
git add Dockerfile nginx.conf .dockerignore
git commit -m "feat: add container image with nginx serving and metrics endpoint"
```

---

### Task 6: Compose File for the VPS

**Files:**

- Create: `compose.portfolio.yml`

**Interfaces:**

- Consumes: Task 5 image (`ghcr.io/aldairgarros/portfolio`, tag via `IMAGE_TAG` env), external `monitoring` network.
- Produces: `compose.portfolio.yml` — SCP'd to the VPS and run with `podman-compose` in Task 7.

- [ ] **Step 1: Write `compose.portfolio.yml`**

```yaml
services:
  portfolio:
    image: ghcr.io/aldairgarros/portfolio:${IMAGE_TAG:-latest}
    container_name: portfolio
    ports:
      - "127.0.0.1:3070:3070"
    restart: unless-stopped
    networks:
      - monitoring
    labels:
      app: portfolio
    logging:
      driver: k8s-file

  portfolio-nginx-exporter:
    image: nginx/nginx-prometheus-exporter:1.4.1
    container_name: portfolio-nginx-exporter
    command:
      - -nginx.scrape-uri=http://portfolio:3070/stub_status
    ports:
      - "127.0.0.1:3071:9113"
    restart: unless-stopped
    networks:
      - monitoring

networks:
  monitoring:
    external: true
```

Notes:

- Ports bind loopback only; host Nginx proxies to `127.0.0.1:3070`.
- `IMAGE_TAG` defaults to `latest` when unset (manual deploys).
- `k8s-file` log driver ensures the existing Promtail picks up logs with `service="portfolio"` (from `container_name`).

- [ ] **Step 2: Validate compose syntax**

```bash
docker compose -f compose.portfolio.yml config --quiet
```

Expected: exit 0, no output. (The external network check happens at deploy time, not config time.)

- [ ] **Step 3: Commit**

```bash
git add compose.portfolio.yml
git commit -m "feat: add podman-compose stack for portfolio on monitoring network"
```

---

### Task 7: Rewrite CI/CD Workflow for Container Deployment

**Files:**

- Modify: `.github/workflows/production.yml`

**Interfaces:**

- Consumes: `Dockerfile` (Task 5), `compose.portfolio.yml` (Task 6).
- Produces: deployment pipeline — build image in CI, push to GHCR, deploy on VPS with rollback.

- [ ] **Step 1: Replace `.github/workflows/production.yml`**

Full new content:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
    types:
      - closed

permissions:
  contents: read
  packages: write

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "23"
          cache: "npm"
      - run: npm ci --legacy-peer-deps --no-audit --no-fund
      - run: npm run lint
      - run: npm run typecheck

  build-and-deploy:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build container image
        run: |
          docker build \
            --build-arg VITE_SENTRY_DSN="${{ secrets.VITE_SENTRY_DSN }}" \
            -t ghcr.io/aldairgarros/portfolio:${{ github.sha }} \
            -t ghcr.io/aldairgarros/portfolio:latest \
            .

      - name: Push image to GHCR
        run: |
          echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker push ghcr.io/aldairgarros/portfolio:${{ github.sha }}
          docker push ghcr.io/aldairgarros/portfolio:latest

      - name: Deploy to VPS
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
          VPS_HOST: ${{ secrets.VPS_HOST }}
          VPS_USER: ${{ secrets.VPS_USER }}
        run: |
          eval "$(ssh-agent -s)"
          echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null
          ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST "mkdir -p ~/portfolio"
          scp -o StrictHostKeyChecking=no compose.portfolio.yml $VPS_USER@$VPS_HOST:~/portfolio/compose.yml
          ssh -o StrictHostKeyChecking=no $VPS_USER@$VPS_HOST << EOF
          set -e
          cd ~/portfolio
          PREV_SHA=\$(cat .previous_sha 2>/dev/null || true)
          podman pull ghcr.io/aldairgarros/portfolio:$GITHUB_SHA
          IMAGE_TAG=$GITHUB_SHA podman-compose up -d
          sleep 5
          if curl -s --head http://127.0.0.1:3070 | grep "200 OK" > /dev/null; then
            echo "Application is healthy"
            echo "$GITHUB_SHA" > .previous_sha
          else
            echo "Error: Application is not accessible"
            if [ -n "\$PREV_SHA" ]; then
              echo "Rolling back to \$PREV_SHA"
              IMAGE_TAG=\$PREV_SHA podman-compose up -d
            else
              echo "Warning: No previous SHA to roll back to"
            fi
            exit 1
          fi
          EOF
```

Notes:

- Adds `permissions.packages: write` (required for GHCR push via `GITHUB_TOKEN`).
- New secret needed: `VITE_SENTRY_DSN` (GlitchTip DSN, `https://PUBLIC_KEY@aldairgarros.com/glitchtip/PROJECT_ID` — set in GitHub repo secrets).
- Existing secrets `SSH_PRIVATE_KEY`, `VPS_HOST`, `VPS_USER` are reused.
- Rollback: the last known-good SHA is stored in `~/portfolio/.previous_sha` on the VPS.
- The `GITHUB_SHA` env var inside the heredoc expands on the runner (unquoted `EOF`); `\$PREV_SHA`/`\$()` escape for remote evaluation.
- **First deploy prerequisite** (one-time, before this workflow runs against the VPS): the VPS needs `podman` + `podman-compose` for the deploy user, and the external `monitoring` network must exist. Run the vps-infrastructure `scripts/create-network.sh` once if missing.

- [ ] **Step 2: Verify workflow syntax**

The workflow YAML parses as valid YAML:

```bash
python3 -c "import yaml,sys; yaml.safe_load(open('.github/workflows/production.yml')); print('valid')"
```

Expected: prints `valid`.

- [ ] **Step 3: Add the VITE_SENTRY_DSN secret**

Either via GitHub UI (Settings → Secrets and variables → Actions → New repository secret) or CLI:

```bash
gh secret set VITE_SENTRY_DSN --repo aldairgarros/portfolio_2024
```

(Paste the DSN when prompted. Create the GlitchTip project first if needed — see Task 9.)

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/production.yml
git commit -m "ci: deploy portfolio via GHCR container with rollback"
```

---

### Task 8: Register Portfolio Scrape Target in vps-infrastructure

**Files (in `/Users/aldairgarros/Projects/vps-infrastructure`, NOT this repo):**

- Modify: `prometheus/prometheus.yml`

**Interfaces:**

- Consumes: Task 6 exporter service (container name `portfolio-nginx-exporter`, port 9113 on `monitoring` network).
- Produces: Prometheus scraping portfolio nginx metrics → Grafana dashboards + existing app alerts.

- [ ] **Step 1: Edit `prometheus/prometheus.yml`**

Append a new job after the `avapa_postgres` job (line ~41):

```yaml
- job_name: portfolio
  scrape_interval: 30s
  static_configs:
    - targets: ["portfolio-nginx-exporter:9113"]
```

- [ ] **Step 2: Validate and deploy**

```bash
cd /Users/aldairgarros/Projects/vps-infrastructure
./scripts/validate-configs.sh
```

Expected: exit 0.

Then commit + push to `main` (the repo's CI deploys automatically), or run the deploy script directly:

```bash
cd /Users/aldairgarros/Projects/vps-infrastructure
./scripts/deploy.sh
```

- [ ] **Step 3: Verify Prometheus discovers the target**

```bash
curl -s http://localhost:9090/api/v1/targets | python3 -m json.tool | grep -B2 -A4 '"job": "portfolio"'
```

Expected: target `portfolio-nginx-exporter:9113` with `"health": "up"`.

- [ ] **Step 4: Commit (in vps-infrastructure repo)**

```bash
cd /Users/aldairgarros/Projects/vps-infrastructure
git add prometheus/prometheus.yml
git commit -m "feat: add portfolio nginx scrape target"
```

---

### Task 9: One-Time Host Nginx Changes (VPS, manual runbook)

**Location:** On the VPS itself — `/etc/nginx/sites-available/` config for `aldairgarros.com` (existing TLS config). Not stored in either repo.

**Interfaces:**

- Consumes: Task 6 (portfolio on `127.0.0.1:3070`), Tempo on `127.0.0.1:4318`, GlitchTip on `127.0.0.1:3001`.
- Produces: TLS entry for `/` → portfolio, `/v1/traces` → Tempo, `/glitchtip/` → GlitchTip.

- [ ] **Step 1: Edit the aldairgarros.com server block**

In the existing `server` block for `aldairgarros.com` (keep `ssl_certificate`, `ssl_certificate_key`, and other TLS directives unchanged), replace the `root /var/www/aldairgarros` + `location /` with:

```nginx
location / {
    proxy_pass http://127.0.0.1:3070;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /v1/traces {
    proxy_pass http://127.0.0.1:4318;
    proxy_set_header Host $host;
}

location /glitchtip/ {
    proxy_pass http://127.0.0.1:3001/;
    proxy_set_header Host $host;
}
```

- [ ] **Step 2: Validate and reload**

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Expected: `nginx -t` prints `syntax is ok` / `test is successful`; reload succeeds.

- [ ] **Step 3: Verify the full path**

```bash
curl -s --head https://aldairgarros.com | head -1
curl -s http://127.0.0.1:3070/stub_status
curl -s -X POST http://127.0.0.1:4318/v1/traces -o /dev/null -w "%{http_code}"
```

Expected: `200 OK` for the site; stub_status returns nginx metrics; Tempo responds (2xx/4xx, not connection refused).

- [ ] **Step 4: Create the GlitchTip project and DSN**

1. Open the GlitchTip UI, create a project for the portfolio (e.g. `portfolio-web`).
2. Copy the project DSN from the UI. It looks like `https://PUBLIC_KEY@glitchtip.your-vps.com/PROJECT_ID`.
3. Rewrite it to route through the reverse proxy: replace `glitchtip.your-vps.com` with `aldairgarros.com/glitchtip` → `https://PUBLIC_KEY@aldairgarros.com/glitchtip/PROJECT_ID`.
4. Set this as the `VITE_SENTRY_DSN` repo secret (Task 7 Step 3).

- [ ] **Step 5: Remove the old static deploy directory** (after the first container deploy is verified healthy — see Task 10)

```bash
sudo rm -rf /var/www/aldairgarros
```

---

### Task 10: End-to-End Verification

**Files:** none (operational checks).

**Interfaces:**

- Consumes: everything deployed by Tasks 7–9.
- Produces: evidence that the full observability pipeline works.

- [ ] **Step 1: Trigger a production deploy**

Push the changes to `main` (or merge the PR). Watch the workflow in GitHub Actions until `build-and-deploy` completes green.

- [ ] **Step 2: Verify the site is served from the container**

```bash
curl -s --head https://aldairgarros.com | head -1
ssh $VPS_USER@$VPS_HOST "podman ps --filter name=portfolio"
```

Expected: site returns `200 OK`; both `portfolio` and `portfolio-nginx-exporter` containers are `Up`.

- [ ] **Step 3: Verify metrics flow**

```bash
curl -s http://localhost:9090/api/v1/targets | python3 -m json.tool | grep -A6 '"job": "portfolio"'
curl -s "http://localhost:9090/api/v1/query?query=nginx_connections_active" | python3 -m json.tool
```

Expected: target `up`; query returns data (metric names like `nginx_connections_active`, `nginx_http_requests_total`).

- [ ] **Step 4: Verify logs flow to Loki**

```bash
curl -s "http://localhost:3100/loki/api/v1/query_range" \
  --data-urlencode 'query={service="portfolio"}' \
  --data-urlencode 'limit=5' | python3 -m json.tool
```

Expected: nginx access/error log lines with `service="portfolio"` label.

- [ ] **Step 5: Verify traces arrive in Tempo**

Browse the live site (a few page loads), then in Grafana → Explore → Tempo, search by service name `portfolio` (browser traces are unnamed-http spans grouped under the page-load root). Expected: document-load traces with web-vital spans; Grafana Tempo UI shows recent traces.

- [ ] **Step 6: Verify errors reach GlitchTip**

Open the site in a browser with DevTools, then deliberately trigger a captured error (e.g. in console: `setTimeout(() => { throw new Error("glitchtip-test"); })`). Wait ~10s, then check the GlitchTip UI.

Expected: the error appears in the portfolio project with `trace_id` and `span_id` tags populated.

- [ ] **Step 7: Confirm blackbox probes still pass**

Grafana → Explore → Prometheus:

```sql
probe_success{job="blackbox", instance="https://aldairgarros.com"}
probe_success{job="blackbox_tls", instance="https://aldairgarros.com"}
```

Expected: both `1`.
