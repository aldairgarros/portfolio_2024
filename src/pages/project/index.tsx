import { useState, useCallback } from "react";
import { ScrollRestoration, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Contact } from "@/modules/Contact";
import { GlassCard } from "@/components/GlassCard";
import { SectionTitle } from "@/components/SectionTitle";
import { ProjectList } from "@/modules/Projects/ProjectList";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";

export function Project() {
  const { project } = useParams();
  const PROJECTLIST = ["penhor", "musicaShow", "bolsobom", "atalaiaPro"];

  const { t: p } = useTranslation("translation", { keyPrefix: `projects.list.${project}` });
  const { t: tProjects } = useTranslation("translation", { keyPrefix: "projects" });

  const imageData = (() => {
    const raw = p("images.list", { returnObjects: true }) as Record<string, unknown> | undefined;
    if (!raw) return [];
    return Object.keys(raw)
      .filter((k) => k.startsWith("image"))
      .map((key) => ({
        src: p(`images.list.${key}.src`),
        alt: p(`images.list.${key}.alt`),
        width: p(`images.list.${key}.width`),
        height: p(`images.list.${key}.height`),
      }));
  })();

  const lightboxImages: LightboxImage[] = imageData.map(({ src, alt }) => ({ src, alt }));

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const linkHref = p("link.href");
  const linkValue = p("link.value");

  return (
    <main className="flex min-h-screen flex-col pt-16">
      <ScrollRestoration />
      <div className="py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-1 text-sm text-accent-600 dark:text-accent-400 hover:text-accent-800 dark:hover:text-accent-200 transition-colors mb-12 focus:ring-2 focus:ring-accent-500 focus:outline-none rounded">
          <ArrowLeft size={16} aria-hidden="true" />
          {tProjects("title")}
        </Link>

        <SectionTitle title={p("name.value")} />

        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-mono text-primary-500 dark:text-primary-400">
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
              className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-full border border-accent-500/30 text-accent-600 dark:text-accent-400 hover:bg-accent-500 hover:text-white transition-colors font-medium text-sm focus:ring-2 focus:ring-accent-500 focus:outline-none">
              {linkValue || "Visit project"}
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          )}

          {imageData.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-primary-500 dark:text-primary-400 mb-4">
                {p("images.label")}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageData.map((img, index) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    width={+img.width}
                    height={+img.height}
                    className="rounded-xl object-contain w-full h-auto cursor-zoom-in hover:ring-2 hover:ring-accent-500/50 transition-all duration-200 bg-white dark:bg-transparent"
                    loading="lazy"
                    onClick={() => openLightbox(index)}
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

      {lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </main>
  );
}
