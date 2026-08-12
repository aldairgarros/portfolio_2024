# Portfolio Containerization & Observability Design

**Date**: 2026-08-02
**Status**: Draft
**Summary**: Containerize the portfolio React SPA into a multi-stage Docker image served by Nginx, deploy it alongside the existing `vps-infrastructure` LGTM stack on the VPS, and instrument the React app with full OpenTelemetry RUM (traces, metrics, Core Web Vitals) plus GlitchTip error tracking.

---

## 1. Goals

- Serve the portfolio from a container (Nginx) instead of static files on the VPS host
- Wire the portfolio into the existing `vps-infrastructure` monitoring stack (`monitoring` podman network)
- Add full browser-side observability: OTel traces, metrics, Core Web Vitals → Tempo
- Add error tracking via the already-deployed GlitchTip (Sentry-compatible SDK)
- Keep host Nginx as the TLS entry point, reverse-proxying to the container
- Preserve existing blackbox HTTP/TLS probes, alerting, and SLOs

---

## 2. Architecture

````
                        VPS Host
┌───────────────────────────────────────────────────────────┐
│ Host Nginx (TLS:443)                                      │
│  /            → proxy_pass → 127.0.0.1:3070              │
│  /v1/traces   → proxy_pass → 127.0.0.1:4318 (tempo)      │
│  /glitchtip/  → proxy_pass → 127.0.0.1:3001 (glitchtip)  │
├───────────────────────────────────────────────────────────┤
│ monitoring network (podman, external)                     │
│                                                           │
│  ┌─ compose.portfolio.yml ─────────────────────────────┐ │
│  │  portfolio (nginx:alpine, port 3070)                │ │
│  │  portfolio-nginx-exporter (:3071→:9113)             │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                           │
│  ┌─ vps-infrastructure/compose.yml (15 services) ─────┐  │
│  │  prometheus, grafana, loki, tempo, promtail,       │  │
│  │  glitchtip+postgres+valkey, exporters, etc.        │  │
│  └──────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────┘

Browser:
  OTel JS SDK ──OTLP HTTP──► Host Nginx /v1/traces ──► Tempo
  GlitchTip SDK ───────────► Host Nginx /glitchtip ───► GlitchTip

### Data flow

- **Logs**: Nginx access/error logs → container stdout → existing Promtail (CRI pipeline) → Loki
- **Metrics**: `nginx-prometheus-exporter` sidecar scrapes `stub_status` → Prometheus
- **Traces**: OTel JS SDK in React app → OTLP HTTP → host Nginx `/v1/traces` → Tempo
- **Errors**: GlitchTip SDK (Sentry-compatible) → host Nginx `/glitchtip` → GlitchTip
- **Blackbox**: existing probes against `https://aldairgarros.com` continue to work unchanged

---

## 3. New Dependencies

| Package | Purpose |
|---------|---------|
| `@opentelemetry/api` | OTel API (trace context access for error correlation) |
| `@opentelemetry/context-zone` | Zone.js context manager (required by user-interaction instrumentation) |
| `@opentelemetry/instrumentation` | `registerInstrumentations` helper |
| `@opentelemetry/sdk-trace-base` | `BatchSpanProcessor`, `ConsoleSpanExporter`, `SpanProcessor` |
| `@opentelemetry/sdk-trace-web` | Browser trace SDK (`WebTracerProvider`) |
| `@opentelemetry/auto-instrumentations-web` | Unified auto-instrumentation (document load, fetch/xhr, user interaction) |
| `@opentelemetry/instrumentation-long-task` | Long-task instrumentation (removed from meta package in v2) |
| `@opentelemetry/exporter-trace-otlp-http` | Traces → Tempo via OTLP HTTP |
| `@sentry/react` | GlitchTip-compatible error tracking SDK |
| `web-vitals` | Core Web Vitals measurement (reported manually as spans; OTel web-vitals instrumentation removed in v2) |

**OTel v2 note:** Installed OTel is the v2 release train (`sdk-trace-web@2.x`, `auto-instrumentations-web@0.66.x`). Span processors are passed via the `WebTracerProvider` constructor (`spanProcessors` array) — `addSpanProcessor` no longer exists.

**Metrics note:** Tempo's OTLP receiver ingests **traces only** — raw OTLP metrics are rejected. Web vitals are therefore reported as **spans** (`web-vitals.<name>` with rating/value/delta attributes); Tempo's metrics-generator (already enabled with `span-metrics` processor) derives RED metrics from them and remote-writes to Prometheus. No metrics exporter package is needed.

~45KB gzipped total bundle increase.

---

## 4. Container Files

### `Dockerfile`

Multi-stage build:

```dockerfile
# Stage 1: Build
FROM node:23-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps --no-audit --no-fund
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3070
````

### `nginx.conf`

```nginx
server {
    listen 3070;
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (hashed filenames)
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Metrics endpoint: exporter sidecar connects over the podman
    # network (10.0.0.0/8); host-local checks connect from loopback.
    location /stub_status {
        stub_status;
        access_log off;
        allow 10.0.0.0/8;
        allow 127.0.0.1;
        deny all;
    }
}
```

### `compose.portfolio.yml`

Image is built in CI and pushed to GHCR (`ghcr.io/aldairgarros/portfolio`); the VPS pulls it. `IMAGE_TAG` is injected at deploy time via env interpolation, defaulting to `latest` for manual runs.

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

Port `3070` chosen per user preference. Exporter uses host port `3071` to avoid conflicts.

---

## 5. React App Instrumentation

### `src/observability/otel.ts`

- `initOpenTelemetry()` called in `main.tsx` **before** React renders (captures full page-load span)
- `getWebAutoInstrumentations()`: document load, fetch/xhr, user interaction (v2 meta package)
- `LongTaskInstrumentation` registered separately (removed from meta package in v2)
- Web vitals reported as **spans** (`web-vitals.<name>` with rating/value/delta/navigation_type attributes) via a separate `web-vitals.ts` module using Google's `web-vitals` package — Tempo's metrics-generator derives metrics from them
- OTLP HTTP trace exporter, endpoint `https://aldairgarros.com/v1/traces`
- `BatchSpanProcessor` (defaults: 5s scheduled delay, 512 max export batch size, 2048 max queue) passed via the `WebTracerProvider` constructor `spanProcessors` array (v2 API)
- Session ID generated via `crypto.randomUUID()`, attached to every span via a custom `SpanProcessor` (`onStart`), first in the array
- Dev mode (`import.meta.env.DEV`): console exporter only — no traffic to production Tempo

### `src/observability/web-vitals.ts`

- New module: `initWebVitalsSpans()` registers `onCLS`/`onFCP`/`onINP`/`onLCP`/`onTTFB` callbacks that emit one span per metric (OTel's own web-vitals instrumentation was removed in the v2 release train)

### `src/observability/glitchtip.ts`

- `initGlitchTip()` called second in `main.tsx`
- DSN from `import.meta.env.VITE_SENTRY_DSN` (CI secret, passed as Docker build-arg), endpoint `https://aldairgarros.com/glitchtip`
- `tracesSampleRate: 0` (traces live in Tempo, not GlitchTip)
- `beforeSend` hook: inject OTel `traceId`/`spanId` into error events for cross-tool correlation

### `src/observability/ErrorBoundary.tsx`

- Separate file (react-refresh lint rule requires component-only files)
- `Sentry.ErrorBoundary` wrapping the app tree, `fallback={undefined}` (Sentry v10 type; renders `null` on error)

### `src/main.tsx` (modify)

Order:

1. `initOpenTelemetry()`
2. `initGlitchTip()`
3. `<StrictMode><App/></StrictMode>`

---

## 6. Host Nginx Changes (manual, one-time, on VPS)

Not stored in this repo — applied directly on the VPS:

```nginx
# Portfolio: replace `root /var/www/aldairgarros` block
location / {
    proxy_pass http://127.0.0.1:3070;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Tempo OTLP — browser traces (Tempo published on host loopback 4318)
location /v1/traces {
    proxy_pass http://127.0.0.1:4318;
}

# GlitchTip ingest (GlitchTip published on host 0.0.0.0:3001)
location /glitchtip/ {
    proxy_pass http://127.0.0.1:3001/;
}
```

---

## 7. CI/CD Changes (`.github/workflows/production.yml`)

Old: build dist → SCP to `/var/www/aldairgarros` → reload nginx

New:

1. `quality` job unchanged (lint + typecheck)
2. `build-and-deploy`: `docker build` with `--build-arg VITE_SENTRY_DSN` → tagged `ghcr.io/aldairgarros/portfolio:$GITHUB_SHA` + `latest`
3. Push both tags to GHCR (using `GITHUB_TOKEN`, `packages: write` permission)
4. SCP `compose.portfolio.yml` to VPS `~/portfolio/compose.yml`
5. SSH: `podman pull ghcr.io/...:$GITHUB_SHA` → `IMAGE_TAG=$GITHUB_SHA podman-compose up -d`
6. Health check: `curl http://127.0.0.1:3070` → 200
7. Record SHA in `~/portfolio/.previous_sha`; on failure, roll back with previous SHA and exit 1

Image build happens inside Docker (`npm ci` + `npm run build` + `tsc -b` typecheck). The old SCP, backup, and `systemctl reload nginx` steps are removed.

---

## 8. vps-infrastructure Changes

### `prometheus/prometheus.yml`

Add scrape job:

```yaml
- job_name: portfolio
  static_configs:
    - targets: ["portfolio-nginx-exporter:9113"]
      labels:
        app: portfolio
        service: nginx
```

Applies to the `vps-infrastructure` repo (separate from this repo).

---

## 9. Already Handled by Existing Infrastructure

- **Logs**: Promtail already scrapes all `k8s-file` container stdout on the host
- **Blackbox probes**: `https://aldairgarros.com` probe remains valid (hits host Nginx)
- **Tempo**: OTLP HTTP receiver on 4318 already configured
- **GlitchTip**: already running; only needs DSN + host Nginx proxy block
- **Alerting**: existing `app_alerts.yml` (5xx rate, p95 latency) automatically covers portfolio if scraped by Prometheus

---

## 10. Cleanup

After successful transition:

- Remove `/var/www/aldairgarros` from VPS
- Remove SCP + backup + nginx-reload logic from CI workflow
- `dist/` stays gitignored (build happens inside Docker)

---

## 11. Out of Scope

- Self-hosting Sentry (GlitchTip already covers error tracking)
- Containerizing host Nginx (stays on host for TLS)
- Dashboard/alert changes in Grafana (existing dashboards/alerts apply via new scrape job)
