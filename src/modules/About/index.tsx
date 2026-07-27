import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";
import { useTranslation } from "react-i18next";

export function About() {
  const { t } = useTranslation("translation", { keyPrefix: "about" });
  const LIST = ["experience1", "experience2"];

  return (
    <section id="about" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <div className="flex flex-col gap-8">
        {LIST.map((item) => (
          <GlassCard key={item} hover className="p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <h3 className="text-xl font-semibold text-primary-900 dark:text-primary-50">
                {t(`list.${item}.title.value`)}
              </h3>
              <span className="text-sm text-primary-500 dark:text-primary-400 mt-1 sm:mt-0">
                {t(`list.${item}.start.value`)} &mdash; {t(`list.${item}.end.value`)}
              </span>
            </div>
            <p className="text-primary-700 dark:text-primary-300 leading-relaxed mb-4">
              {t(`list.${item}.description.value`)}
            </p>
            <div className="space-y-3 text-sm">
              <p>
                <span className="font-medium text-primary-900 dark:text-primary-50">
                  {t(`list.${item}.work.label`)}:
                </span>{" "}
                <span className="text-primary-600 dark:text-primary-400">
                  {t(`list.${item}.work.value`)}
                </span>
              </p>
              <p>
                <span className="font-medium text-primary-900 dark:text-primary-50">
                  {t(`list.${item}.tools.label`)}:
                </span>{" "}
                <span className="text-primary-600 dark:text-primary-400">
                  {t(`list.${item}.tools.value`)}
                </span>
              </p>
              <p>
                <span className="font-medium text-primary-900 dark:text-primary-50">
                  {t(`list.${item}.achievements.label`)}:
                </span>{" "}
                <span className="text-primary-600 dark:text-primary-400">
                  {t(`list.${item}.achievements.value`)}
                </span>
              </p>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
