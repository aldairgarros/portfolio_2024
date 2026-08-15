import { Experiences } from "@/modules/Experiences";
import { Credentials } from "@/modules/Credentials";
import { Expertise } from "@/modules/Expertise";
import { Hero } from "@/modules/Hero";
import { Projects } from "@/modules/Projects";

export function Home() {
  return (
    <main className="min-h-screen pb-10 w-full min-w-0">
      <Hero />
      <Credentials />
      <Expertise />
      <Experiences />
      <Projects />
    </main>
  );
}
