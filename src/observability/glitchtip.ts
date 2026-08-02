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
