import { SectionTitle } from "@/components/SectionTitle";
import { ProjectCard } from "./ProjectCard";
import { useTranslation } from "react-i18next";

interface Props {
  list: string[];
}

export function ProjectList({ list }: Props) {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });

  if (list.length === 0) return null;

  return (
    <section className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {list.map((project) => (
          <ProjectCard key={project} project={project} />
        ))}
      </div>
    </section>
  );
}
