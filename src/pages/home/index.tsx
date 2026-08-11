import { useTranslation } from "react-i18next";
import { About } from "@/modules/About";
import { Education } from "@/modules/Education";
import { Expertise } from "@/modules/Expertise";
import { Hero } from "@/modules/Hero";
import { ProjectDetail } from "@/modules/Projects/ProjectDetail";
import { SectionTitle } from "@/components/SectionTitle";

const PROJECTS = ["atalaiaPro", "penhor", "bolsobom", "musicaShow"];

export function Home() {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });

  return (
    <main className="flex min-h-screen flex-col pb-14">
      <Hero />
      <About />
      <Expertise />
      <section id="projects" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <SectionTitle title={t("title")} />
        <div className="flex flex-col">
          {PROJECTS.map((project, index) => (
            <div
              key={project}
              className={index > 0 ? "border-t border-zinc-200/30 dark:border-zinc-700/20 mt-16 pt-16" : ""}>
              <ProjectDetail project={project} flip={index % 2 !== 0} />
            </div>
          ))}
        </div>
      </section>
      <Education />
    </main>
  );
}
