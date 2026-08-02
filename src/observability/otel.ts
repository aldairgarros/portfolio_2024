import { Span } from "@opentelemetry/api";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { BatchSpanProcessor, ConsoleSpanExporter, SpanProcessor } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { getWebAutoInstrumentations } from "@opentelemetry/auto-instrumentations-web";

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
  const provider = new WebTracerProvider();

  provider.addSpanProcessor(new SessionIdSpanProcessor());

  if (import.meta.env.DEV) {
    provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));
  } else {
    provider.addSpanProcessor(
      new BatchSpanProcessor(
        new OTLPTraceExporter({ url: "https://aldairgarros.com/v1/traces" }),
      ),
    );
  }

  provider.register({ contextManager: new ZoneContextManager() });

  registerInstrumentations({
    tracerProvider: provider,
    instrumentations: [
      getWebAutoInstrumentations({
        webVitalsInstrumentationConfig: { mode: "span" },
      }),
    ],
  });
}
