import { Section } from "@/components/Section";
import { SectionContent } from "@/components/SectionContent";
import { SectionItem } from "@/components/SectionItem";
import { useActiveSection } from "@/context/ActiveSectionContext";
import { ExperienceItem } from "@/modules/Experiences/ExperienceItem";
import { EXPERIENCE_LIST, EXPERIENCE_PATHS } from "@/modules/Experiences/types";
import { useTranslation } from "react-i18next";

export function Experiences() {
  const { t } = useTranslation("translation", { keyPrefix: "experiences" });
  const sectionRef = useActiveSection("~/experiences");

  return (
    <Section
      id="experiences"
      title={t("title")}
      sectionRef={sectionRef}
      className="bg-zinc-200 dark:bg-zinc-900"
    >
      <SectionContent>
        {EXPERIENCE_LIST.map((item, index) => (
          <SectionItem key={item} id={item} path={EXPERIENCE_PATHS[item]} delay={index * 0.15}>
            <ExperienceItem item={item} />
          </SectionItem>
        ))}
      </SectionContent>
    </Section>
  );
}
