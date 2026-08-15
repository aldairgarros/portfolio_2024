import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, type Shade } from "@/components/Card";
import { CardLabel } from "@/components/CardLabel";
import { Section } from "@/components/Section";
import { SectionContent } from "@/components/SectionContent";
import { SectionHeader } from "@/components/SectionHeader";
import { SectionItem } from "@/components/SectionItem";
import { useActiveSection } from "@/context/ActiveSectionContext";
import { staggerContainerVariants } from "@/lib/motion";
import { Skill } from "@/modules/Expertise/Skill";
import expertise from "@/assets/expertise.json";

type CapabilityId = (typeof expertise)[number]["id"];

const CAPABILITY_PATHS: Record<CapabilityId, string> = Object.fromEntries(
  expertise.map((capability) => [capability.id, `~/expertise/${capability.id}`]),
);

const SECTIONS: { key: string; shade: Shade }[] = [
  { key: "context", shade: "white" },
  { key: "applicability", shade: "soft" },
  { key: "impact", shade: "green" },
];

export function Expertise() {
  const { t } = useTranslation("translation", { keyPrefix: "expertise" });

  const sectionRef = useActiveSection("~/expertise");

  return (
    <Section
      id="expertise"
      title={t("title")}
      sectionRef={sectionRef}
      className="bg-zinc-100 dark:bg-zinc-900"
    >
      <SectionContent variant="grid">
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-2 sm:gap-4 scroll-mt-16"
        >
          {expertise.map((capability, index) => (
            <SectionItem
              key={capability.id}
              id={capability.id}
              path={CAPABILITY_PATHS[capability.id]}
              delay={index * 0.1}
              trigger="inherit"
              className="flex flex-col gap-2 sm:gap-4"
            >
              <SectionHeader
                title={t(`list.${capability.id}.title`)}
                className="flex flex-col gap-2 sm:gap-4 p-3 sm:p-6 text-center"
                titleClassName="text-2xl sm:text-4xl"
              />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {SECTIONS.map(({ key, shade }) => (
                  <Card key={key} shade={shade}>
                    <CardLabel className="sm:mb-8">{t(`${key}Label`)}</CardLabel>
                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed text-base sm:text-lg">
                      {t(`list.${capability.id}.${key}`)}
                    </p>
                  </Card>
                ))}
                <div className="flex items-center justify-center py-6 px-4 lg:col-span-3 flex-wrap gap-2.5">
                  {capability.tech.map((tech) => (
                    <Skill key={tech} expertise={capability.id} skill={tech} />
                  ))}
                </div>
              </div>
            </SectionItem>
          ))}
        </motion.div>
      </SectionContent>
    </Section>
  );
}
