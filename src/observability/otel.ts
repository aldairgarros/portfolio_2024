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
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { SEMRESATTRS_SERVICE_NAME } from "@opentelemetry/semantic-conventions";
import { v4 as uuidv4 } from "uuid";
import { initWebVitalsSpans } from "./web-vitals.ts";

const SESSION_ID = uuidv4();

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
    const endpoint = import.meta.env.VITE_OTLP_ENDPOINT as string | undefined;

    if (endpoint) {
      spanProcessors.push(new BatchSpanProcessor(new OTLPTraceExporter({ url: endpoint })));
    }
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
