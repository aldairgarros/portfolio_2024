import { useTranslation } from "react-i18next";
import { GraduationCap } from "lucide-react";
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";

export function Education() {
  const { t } = useTranslation("translation", { keyPrefix: "education" });

  return (
    <section id="education" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <h2 className="sr-only">{t("title")}</h2>
      <TerminalFrame title={t("title")}>
        <TerminalPanel title={t("course.title")}>
          <div className="flex items-center gap-2 text-sm font-mono text-primary-500 dark:text-primary-400 mb-4">
            <GraduationCap size={16} className="text-emerald-400 shrink-0" aria-hidden="true" />
            {t("course.institution")} &mdash; {t("course.period")}
          </div>
          <p className="text-primary-700 dark:text-primary-300 leading-relaxed">{t("course.description")}</p>
        </TerminalPanel>
      </TerminalFrame>
    </section>
  );
}
