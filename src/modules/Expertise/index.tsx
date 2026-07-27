import { useTranslation } from "react-i18next";
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";
import { Skill } from "@/modules/Expertise/Skill";
import expertise from "@/assets/expertise.json";

export function Expertise() {
  const { t } = useTranslation("translation", { keyPrefix: "expertise" });

  return (
    <section id="expertise" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {expertise.map((capability, index) => {
          const isLastOdd =
            index === expertise.length - 1 && expertise.length % 2 !== 0;

          return (
            <GlassCard
              key={capability.id}
              hover
              className={`p-8 ${isLastOdd ? "md:col-span-2" : ""}`}>
              <h3 className="text-xl font-semibold text-primary-900 dark:text-primary-50 mb-4">
                {t(`list.${capability.id}.title`)}
              </h3>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-medium text-primary-900 dark:text-primary-50">
                    {t("contextLabel")}:
                  </span>{" "}
                  <span className="text-primary-600 dark:text-primary-400">
                    {t(`list.${capability.id}.context`)}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-primary-900 dark:text-primary-50">
                    {t("applicabilityLabel")}:
                  </span>{" "}
                  <span className="text-primary-600 dark:text-primary-400">
                    {t(`list.${capability.id}.applicability`)}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-primary-900 dark:text-primary-50">
                    {t("impactLabel")}:
                  </span>{" "}
                  <span className="text-primary-600 dark:text-primary-400">
                    {t(`list.${capability.id}.impact`)}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {capability.tech.map((tech) => (
                  <Skill key={tech} expertise={capability.id} skill={tech} />
                ))}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
