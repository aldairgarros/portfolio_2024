import { useTranslation } from "react-i18next";
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";

export function Education() {
  const { t } = useTranslation("translation", { keyPrefix: "education" });

  return (
    <section id="education" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <GlassCard hover className="max-w-2xl">
        <div className="flex items-start gap-4">
          <span className="text-3xl">&#x1F393;</span>
          <div>
            <h3 className="text-xl font-semibold text-primary-900 dark:text-primary-50">
              {t("course.title")}
            </h3>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
              {t("course.institution")} &mdash; {t("course.period")}
            </p>
            <p className="mt-4 text-primary-700 dark:text-primary-300 leading-relaxed">
              {t("course.description")}
            </p>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
