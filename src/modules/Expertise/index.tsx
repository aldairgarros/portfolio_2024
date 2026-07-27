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
      <div className="flex flex-col gap-12">
        {expertise.map((field) => (
          <div key={field.name}>
            <h3 className="text-lg font-semibold text-secondary-600 dark:text-secondary-400 mb-4">
              {t(`list.${field.name}.title`)}
            </h3>
            <GlassCard>
              <div className="flex flex-wrap gap-4">
                {field.values.map((value) => (
                  <Skill key={value} expertise={field.name} skill={value} />
                ))}
              </div>
            </GlassCard>
          </div>
        ))}
      </div>
    </section>
  );
}
