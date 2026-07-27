import { ScrollRestoration, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Contact } from "@/modules/Contact";
import { GlassCard } from "@/components/GlassCard";
import { SectionTitle } from "@/components/SectionTitle";
import { ProjectList } from "@/modules/Projects/ProjectList";

interface ImageData {
  src: string;
  alt: string;
  width: string;
  height: string;
}

export function Project() {
  const { project } = useParams();
  const PROJECTLIST = ["penhor", "musicaShow", "bolsobom", "atalaiaPro"];

  const { t: p } = useTranslation("translation", { keyPrefix: `projects.list.${project}` });
  const { t: tProjects } = useTranslation("translation", { keyPrefix: "projects" });

  const imageKeys = Object.keys(
    (p("images.list", { returnObjects: true }) as Record<string, unknown>) || {}
  ).filter((k) => k.startsWith("image"));

  const images: ImageData[] = imageKeys.map((key: string) => ({
    src: p(`images.list.${key}.src`),
    alt: p(`images.list.${key}.alt`),
    width: p(`images.list.${key}.width`),
    height: p(`images.list.${key}.height`),
  }));

  const linkHref = p("link.href");
  const linkValue = p("link.value");

  return (
    <main className="flex min-h-screen flex-col pt-16">
      <ScrollRestoration />
      <div className="py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-1 text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-800 dark:hover:text-secondary-200 transition-colors mb-12 focus:ring-2 focus:ring-secondary-500 focus:outline-none rounded">
          <span aria-hidden="true">&larr;</span>
          {tProjects("title")}
        </Link>

        <SectionTitle title={p("name.value")} />

        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary-500 dark:text-primary-400">
              {p("date.value")}
            </span>
          </div>

          <GlassCard>
            <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
              {p("description.value")}
            </p>
          </GlassCard>

          <GlassCard>
            <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
              {p("details.value")}
            </p>
          </GlassCard>

          {linkHref && (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-full border border-secondary-500/30 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-500 hover:text-white transition-colors font-medium text-sm focus:ring-2 focus:ring-secondary-500 focus:outline-none">
              {linkValue || "Visit project"}
              <span aria-hidden="true">&nearr;</span>
            </a>
          )}

          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-primary-500 dark:text-primary-400 mb-4">
                {p("images.label")}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((img) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    width={+img.width}
                    height={+img.height}
                    className="rounded-xl object-contain w-full h-auto"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-primary-100/50 dark:bg-primary-800/30">
        <ProjectList list={PROJECTLIST.filter((item) => item !== project)} />
      </div>

      <div className="w-full">
        <Contact />
      </div>
    </main>
  );
}
