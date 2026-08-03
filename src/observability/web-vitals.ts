import { trace } from "@opentelemetry/api";
import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import type { Metric } from "web-vitals";

function reportWebVital(metric: Metric): void {
  const span = trace
    .getTracer("portfolio")
    .startSpan(`web-vitals.${metric.name.toLowerCase()}`);

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
