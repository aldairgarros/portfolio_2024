import type { ReactNode } from "react";
import * as Sentry from "@sentry/react";
import { useTranslation } from "react-i18next";

function Fallback(): React.JSX.Element {
  const { t } = useTranslation("translation", { keyPrefix: "error" });
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center font-mono">
      <h1 className="text-2xl text-emerald-600 dark:text-emerald-400">{t("title")}</h1>
      <p className="text-zinc-700 dark:text-zinc-300">{t("message")}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-emerald-500 px-6 py-3 text-white hover:bg-emerald-600"
      >
        {t("reload")}
      </button>
    </div>
  );
}

export function GlitchTipErrorBoundary({ children }: { children: ReactNode }): React.JSX.Element {
  return <Sentry.ErrorBoundary fallback={<Fallback />}>{children}</Sentry.ErrorBoundary>;
}
