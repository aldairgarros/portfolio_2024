import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";

export function Education() {
  const { t } = useTranslation("translation", { keyPrefix: "education" });

  return (
    <section id="education" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} icon={GraduationCap} />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}>
        <GlassCard hover className="max-w-2xl border-l-2 border-l-amber-400/60">
          <div className="flex items-start gap-4">
            <GraduationCap size={28} className="text-amber-400 shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-semibold font-heading text-primary-900 dark:text-primary-50">{t("course.title")}</h3>
              <p className="text-sm text-accent-600 dark:text-accent-400 mt-1">
                {t("course.institution")} &mdash; {t("course.period")}
              </p>
              <p className="mt-4 text-primary-700 dark:text-primary-300 leading-relaxed">{t("course.description")}</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </section>
  );
}
