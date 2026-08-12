import { useTranslation } from "react-i18next";
import { GraduationCap } from "lucide-react";
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";
import { useActiveSection } from "@/context/ActiveSectionContext";

export function Education() {
  const { t } = useTranslation("translation", { keyPrefix: "education" });
  const sectionRef = useActiveSection("~/education");

  return (
    <section id="education" ref={sectionRef} className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full">
      <h2 className="sr-only">{t("title")}</h2>
      <TerminalFrame title={t("title")}>
        <div className="p-6 sm:p-8">
          <TerminalPanel title={t("course.title")}>
            <div className="flex items-center gap-2 text-sm font-mono text-zinc-500 dark:text-zinc-400 mb-4">
              <GraduationCap size={16} className="text-emerald-500 shrink-0" aria-hidden="true" />
              {t("course.institution")} &mdash; {t("course.period")}
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{t("course.description")}</p>
          </TerminalPanel>
        </div>
      </TerminalFrame>
    </section>
  );
}
