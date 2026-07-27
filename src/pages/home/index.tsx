import { Hero } from "@/modules/Hero";
import { Education } from "@/modules/Education";
import { Projects } from "@/modules/Projects";
import { Expertise } from "@/modules/Expertise";
import { About } from "@/modules/About";
import { Contact } from "@/modules/Contact";
import { Sticker } from "@/modules/Sticker";

export function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Education />
      <Projects />
      <Expertise />
      <About />
      <Contact />
      <Sticker />
    </main>
  );
}
