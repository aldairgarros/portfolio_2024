import { About } from "@/modules/About";
import { Contact } from "@/modules/Contact";
import { Education } from "@/modules/Education";
import { Expertise } from "@/modules/Expertise";
import { Hero } from "@/modules/Hero";
import { ProjectDetail } from "@/modules/Projects/ProjectDetail";

const PROJECTS = ["atalaiaPro", "penhor", "bolsobom", "musicaShow"];

export function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <About />
      <Expertise />
      {PROJECTS.map((project, index) => (
        <ProjectDetail key={project} project={project} tinted={index % 2 !== 0} />
      ))}
      <Education />
      <Contact />
    </main>
  );
}
