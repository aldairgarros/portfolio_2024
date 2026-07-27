import { SectionTitle } from "@/components/SectionTitle";
import { ProjectCard } from "./ProjectCard";
import { useTranslation } from "react-i18next";

export function Projects() {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });
  const projects = ["penhor", "musicaShow", "bolsobom", "atalaiaPro"];

  return (
    <section id="projects" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project} project={project} />
        ))}
      </div>
    </section>
  );
}
