import type { ReactNode } from "react";
import * as Sentry from "@sentry/react";

export function GlitchTipErrorBoundary({ children }: { children: ReactNode }): React.JSX.Element {
  return <Sentry.ErrorBoundary fallback={null}>{children}</Sentry.ErrorBoundary>;
}
