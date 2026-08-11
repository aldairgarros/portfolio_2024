import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { SectionTitle } from "@/components/SectionTitle";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";

interface Props {
  project: string;
  tinted?: boolean;
}

export function ProjectDetail({ project, tinted = false }: Props): React.JSX.Element {
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
  const label = p("images.label");

  return (
    <section
      id={project}
      className={`py-24 px-4 sm:px-8 ${tinted ? "bg-accent-500/5" : ""}`}>
      <div className="max-w-6xl mx-auto">
        <SectionTitle title={p("name.value")} />

        <div className="flex flex-col gap-8">
          <span className="text-sm font-mono text-primary-500 dark:text-primary-400">
            {p("date.value")}
          </span>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          {linkHref && (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-full border border-amber-400/40 dark:border-amber-500/40 text-accent-600 dark:text-accent-400 hover:bg-gradient-to-r hover:from-amber-400 hover:to-rose-400 hover:text-white hover:border-transparent transition-all font-medium text-sm focus:ring-2 focus:ring-accent-500 focus:outline-none">
              {linkValue || tProjects("open")}
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          )}

          {imageData.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-primary-500 dark:text-primary-400 mb-4">
                {label}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageData.map((img, index) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    width={+img.width}
                    height={+img.height}
                    className="rounded-2xl object-contain w-full h-auto cursor-zoom-in hover:ring-2 hover:ring-amber-400/60 transition-all duration-200 bg-white dark:bg-transparent"
                    loading="lazy"
                    onClick={() => openLightbox(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {lightboxImages.length > 0 && (
        <Lightbox
          images={lightboxImages}
          initialIndex={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </section>
  );
}
