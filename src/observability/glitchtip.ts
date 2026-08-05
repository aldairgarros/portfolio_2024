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
    environment: import.meta.env.PROD ? "production" : "development",
    tracesSampleRate: 1.0,
    beforeSend(event) {
      try {
        const spanContext = trace.getSpan(context.active())?.spanContext();

        if (spanContext) {
          event.tags = {
            ...event.tags,
            trace_id: spanContext.traceId,
            span_id: spanContext.spanId,
          };
        }
      } catch (error) {
        console.warn("[observability] failed to attach trace context", error);
      }

      return event;
    },
  });
}
