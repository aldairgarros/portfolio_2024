import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";
import { useTranslation } from "react-i18next";

const EXTERNAL_KEYS = ["whatsApp", "linkedIn", "github"];

export function Contact() {
  const { t } = useTranslation("translation", { keyPrefix: "contact" });
  const keys = ["email", "phone", "whatsApp", "linkedIn", "github"] as const;

  return (
    <section id="contact" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <GlassCard className="flex items-center">
          <p className="text-primary-700 dark:text-primary-300 leading-relaxed text-lg">
            {t("message")}
          </p>
        </GlassCard>
        <div className="flex flex-col gap-3">
          {keys.map((key) => {
            const href = t(`list.${key}.href`);
            const value = t(`list.${key}.value`);
            const isExternal = EXTERNAL_KEYS.includes(key);

            const extraProps = isExternal
              ? { target: "_blank", rel: "noopener noreferrer" as const }
              : {};

            return (
              <a
                key={key}
                href={href}
                {...extraProps}
                className="px-4 py-3 rounded-full border border-primary-200 dark:border-primary-700 text-sm text-primary-700 dark:text-primary-300 hover:bg-secondary-500 hover:text-white hover:border-secondary-500 transition-colors focus:ring-2 focus:ring-secondary-500 focus:outline-none">
                {value}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
