import { useTranslation } from "react-i18next";
import { About } from "@/modules/About";
import { Education } from "@/modules/Education";
import { Expertise } from "@/modules/Expertise";
import { Hero } from "@/modules/Hero";
import { ProjectDetail } from "@/modules/Projects/ProjectDetail";
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";

const PROJECTS = ["atalaiaPro", "penhor", "bolsobom", "musicaShow"];

export function Home() {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });

  return (
    <main className="flex min-h-screen flex-col pb-10">
      <Hero />
      <About />
      <Expertise />
      <section id="projects" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <h2 className="sr-only">{t("title")}</h2>
        <TerminalFrame title={t("title")}>
          {PROJECTS.map((project, index) => (
            <TerminalPanel
              key={project}
              title={(
                <span className="inline-flex items-center gap-3">
                  {t(`list.${project}.name.value`)}
                  <span className="text-xs text-primary-500 dark:text-primary-400">
                    {t(`list.${project}.date.value`)}
                  </span>
                </span>
              )}>
              <ProjectDetail project={project} flip={index % 2 !== 0} />
            </TerminalPanel>
          ))}
        </TerminalFrame>
      </section>
      <Education />
    </main>
  );
}
