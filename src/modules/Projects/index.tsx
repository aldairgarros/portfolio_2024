import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { SectionContent } from "@/components/SectionContent";
import { SectionHeader } from "@/components/SectionHeader";
import { SectionItem } from "@/components/SectionItem";
import { useActiveSection } from "@/context/ActiveSectionContext";
import { ProjectDetail } from "@/modules/Projects/ProjectDetail";
import { useTranslation } from "react-i18next";

const PROJECTS = ["atalaiaPro", "penhor", "bolsobom", "musicaShow"] as const;

const PROJECT_PATHS: Record<(typeof PROJECTS)[number], string> = {
  atalaiaPro: "~/projects/atalaia-pro",
  penhor: "~/projects/penhor",
  bolsobom: "~/projects/bolso-bom",
  musicaShow: "~/projects/musica-show",
};

export function Projects() {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });
  const projectsRef = useActiveSection("~/projects");

  return (
    <Section
      id="projects"
      title={t("title")}
      sectionRef={projectsRef}
      className="bg-zinc-100 dark:bg-zinc-900"
    >
      <SectionContent>
        {PROJECTS.map((project, index) => (
          <SectionItem key={project} id={project} path={PROJECT_PATHS[project]} delay={index * 0.1}>
            <div className="flex flex-col gap-2 sm:gap-4">
              <SectionHeader
                title={t(`list.${project}.name.value`)}
                subtitle={t(`list.${project}.date.value`)}
                className="flex flex-col gap-2 sm:gap-4 p-3 sm:p-6 text-center"
                titleClassName="text-2xl sm:text-4xl"
                subtitleClassName="text-base sm:text-xl text-zinc-700 dark:text-zinc-300"
              />
              <Card shade="white">
                <ProjectDetail project={project} />
              </Card>
            </div>
          </SectionItem>
        ))}
      </SectionContent>
    </Section>
  );
}
