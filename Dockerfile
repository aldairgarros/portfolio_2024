# Stage 1: Build
FROM node:24-alpine AS builder
WORKDIR /app

ARG VITE_SENTRY_DSN
ENV VITE_SENTRY_DSN=$VITE_SENTRY_DSN
ARG VITE_OTLP_ENDPOINT
ENV VITE_OTLP_ENDPOINT=$VITE_OTLP_ENDPOINT

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:1.31.3-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 3070
