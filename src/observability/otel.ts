import { Span } from "@opentelemetry/api";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { LongTaskInstrumentation } from "@opentelemetry/instrumentation-long-task";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SpanProcessor,
} from "@opentelemetry/sdk-trace-base";
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { initWebVitalsSpans } from "./web-vitals.ts";

const SESSION_ID = crypto.randomUUID();

class SessionIdSpanProcessor implements SpanProcessor {
  onStart(span: Span): void {
    span.setAttribute("session.id", SESSION_ID);
  }

  onEnd(): void {
    /* no-op */
  }

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
      new BatchSpanProcessor(
        new OTLPTraceExporter({ url: import.meta.env.VITE_OTLP_ENDPOINT as string }),
      ),
    );
  }

  const provider = new WebTracerProvider({
    resource: resourceFromAttributes({ [SEMRESATTRS_SERVICE_NAME]: "portfolio" }),
    spanProcessors,
  });

  provider.register({ contextManager: new ZoneContextManager() });

  window.addEventListener("pagehide", () => {
    void provider.forceFlush();
  });

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [getWebAutoInstrumentations(), new LongTaskInstrumentation()],
  });

  initWebVitalsSpans();
}
