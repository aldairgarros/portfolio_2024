import { About } from "@/modules/About";
import { Contact } from "@/modules/Contact";
import { Education } from "@/modules/Education";
import { Expertise } from "@/modules/Expertise";
import { Hero } from "@/modules/Hero";
import { Projects } from "@/modules/Projects";

export function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Education />
      <Projects />
      <Expertise />
      <About />
      <Contact />
    </main>
  );
}
