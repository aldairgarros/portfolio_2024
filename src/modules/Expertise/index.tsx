import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";
import { Skill } from "@/modules/Expertise/Skill";
import expertise from "@/assets/expertise.json";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function Expertise() {
  const { t } = useTranslation("translation", { keyPrefix: "expertise" });

  return (
    <section id="expertise" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {expertise.map((capability, index) => {
          const isLastOdd =
            index === expertise.length - 1 && expertise.length % 2 !== 0;

          return (
            <motion.div key={capability.id} variants={itemVariants}>
              <GlassCard
                hover
                className={`p-8 border-t-2 border-t-amber-400/60 ${isLastOdd ? "md:col-span-2" : ""}`}>
                <h3 className="text-xl font-semibold font-heading text-primary-900 dark:text-primary-50 mb-4">
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
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
