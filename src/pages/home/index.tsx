import { useTranslation } from "react-i18next";
import { About } from "@/modules/About";
import { Education } from "@/modules/Education";
import { Expertise } from "@/modules/Expertise";
import { Hero } from "@/modules/Hero";
import { ProjectDetail } from "@/modules/Projects/ProjectDetail";
import { TerminalFrame, TerminalPanel } from "@/components/TerminalFrame";
import { useActiveSection } from "@/context/ActiveSectionContext";

const PROJECTS = ["atalaiaPro", "penhor", "bolsobom", "musicaShow"] as const;

const PROJECT_PATHS: Record<(typeof PROJECTS)[number], string> = {
  atalaiaPro: "~/projects/atalaia-pro",
  penhor: "~/projects/penhor",
  bolsobom: "~/projects/bolso-bom",
  musicaShow: "~/projects/musica-show",
};

export function Home() {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });
  const projectsRef = useActiveSection("~/projects");
  const projectRefs = {
    atalaiaPro: useActiveSection(PROJECT_PATHS.atalaiaPro),
    penhor: useActiveSection(PROJECT_PATHS.penhor),
    bolsobom: useActiveSection(PROJECT_PATHS.bolsobom),
    musicaShow: useActiveSection(PROJECT_PATHS.musicaShow),
  };

  return (
    <main className="flex min-h-screen flex-col pb-10 min-w-0">
      <Hero />
      <About />
      <Expertise />
      <section
        id="projects"
        ref={projectsRef}
        className="pb-20 px-4 sm:px-8 max-w-6xl mx-auto w-full scroll-mt-16"
      >
        <h2 className="sr-only">{t("title")}</h2>
        <TerminalFrame title={t("title")}>
          <div className="flex flex-col gap-6 p-6 sm:p-8">
            {PROJECTS.map((project) => (
              <TerminalPanel
                key={project}
                ref={projectRefs[project]}
                id={project}
                className="scroll-mt-16"
                title={
                  <span className="inline-flex items-center gap-3">
                    {t(`list.${project}.name.value`)}
                    <span className="text-xs text-primary-500 dark:text-primary-400">
                      {t(`list.${project}.date.value`)}
                    </span>
                  </span>
                }
              >
                <ProjectDetail project={project} />
              </TerminalPanel>
            ))}
          </div>
        </TerminalFrame>
      </section>
      <Education />
    </main>
  );
}
