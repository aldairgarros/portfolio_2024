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
  </StrictMode>
);
