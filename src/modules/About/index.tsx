import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";
import { useTranslation } from "react-i18next";

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export function About() {
  const { t } = useTranslation("translation", { keyPrefix: "about" });
  const LIST = ["experience1", "experience2"];

  return (
    <section id="about" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <h2 className="sr-only">{t("title")}</h2>
      <TerminalFrame title={t("title")}>
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          {LIST.map((item, index) => (
            <motion.div
              key={item}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.15 }}
            >
            <TerminalPanel title={t(`list.${item}.title.value`)}>
              <div className="flex items-center gap-2 text-sm font-mono text-primary-500 dark:text-primary-400 mb-4">
                <Calendar size={14} className="text-emerald-400 shrink-0" aria-hidden="true" />
                {t(`list.${item}.start.value`)} &mdash; {t(`list.${item}.end.value`)}
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
            </TerminalPanel>
            </motion.div>
          ))}
        </div>
      </TerminalFrame>
    </section>
  );
}
