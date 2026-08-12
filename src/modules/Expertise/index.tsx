import { type RefCallback } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";
import { useActiveSection } from "@/context/ActiveSectionContext";
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

  const sectionRef = useActiveSection("~/expertise");
  type CapabilityId = (typeof expertise)[number]["id"];
  const capabilityRefs: Record<CapabilityId, RefCallback<HTMLElement>> = {
    "api-backend": useActiveSection("~/expertise/api-backend"),
    "frontend-engineering": useActiveSection("~/expertise/frontend-engineering"),
    mobile: useActiveSection("~/expertise/mobile"),
    devops: useActiveSection("~/expertise/devops"),
    "ux-strategy": useActiveSection("~/expertise/ux-strategy"),
  };
  if (import.meta.env.DEV) {
    for (const capability of expertise) {
      if (!(capability.id in capabilityRefs)) {
        console.warn(`Missing menubar path ref for expertise capability: ${capability.id}`);
      }
    }
  }

  return (
    <section
      id="expertise"
      ref={sectionRef}
      className="py-20 px-4 sm:px-8 max-w-6xl mx-auto w-full"
    >
      <h2 className="sr-only">{t("title")}</h2>
      <TerminalFrame title={t("title")}>
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="flex flex-col gap-6"
          >
            {expertise.map((capability, index) => (
              <motion.div
                key={capability.id}
                ref={capabilityRefs[capability.id]}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                <TerminalPanel title={t(`list.${capability.id}.title`)}>
                  <div className="space-y-3 text-sm">
                    <p>
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {t("contextLabel")}:
                      </span>{" "}
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {t(`list.${capability.id}.context`)}
                      </span>
                    </p>
                    <p>
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {t("applicabilityLabel")}:
                      </span>{" "}
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {t(`list.${capability.id}.applicability`)}
                      </span>
                    </p>
                    <p>
                      <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                        {t("impactLabel")}:
                      </span>{" "}
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {t(`list.${capability.id}.impact`)}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {capability.tech.map((tech) => (
                      <Skill key={tech} expertise={capability.id} skill={tech} />
                    ))}
                  </div>
                </TerminalPanel>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </TerminalFrame>
    </section>
  );
}
