import { useTranslation } from "react-i18next";
import { About } from "@/modules/About";
import { Contact } from "@/modules/Contact";
import { Education } from "@/modules/Education";
import { Expertise } from "@/modules/Expertise";
import { Hero } from "@/modules/Hero";
import { ProjectDetail } from "@/modules/Projects/ProjectDetail";
import { SectionTitle } from "@/components/SectionTitle";

const PROJECTS = ["atalaiaPro", "penhor", "bolsobom", "musicaShow"];

export function Home() {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <About />
      <Expertise />
      <section id="projects" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <SectionTitle title={t("title")} />
        <div className="flex flex-col gap-16">
          {PROJECTS.map((project, index) => (
            <ProjectDetail key={project} project={project} flip={index % 2 !== 0} />
          ))}
        </div>
      </section>
      <Education />
      <Contact />
    </main>
  );
}
