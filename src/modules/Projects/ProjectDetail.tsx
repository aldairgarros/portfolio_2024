import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";

interface Props {
  project: string;
  flip?: boolean;
}

export function ProjectDetail({ project, flip = false }: Props): React.JSX.Element {
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
  const mainSrc = p("image.src");
  const mainAlt = p("image.alt");

  return (
    <section id={project} className="py-24 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionTitle title={p("name.value")} />

        <div className="rounded-2xl backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-zinc-200/30 dark:border-zinc-700/20 shadow-lg dark:shadow-[0_0_30px_rgba(5,150,105,0.05)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
            <div className={`flex flex-col justify-center ${flip ? "md:order-2" : ""}`}>
              <img
                src={mainSrc}
                alt={mainAlt}
                width={600}
                height={400}
                className="w-full h-auto object-contain rounded-xl bg-white dark:bg-transparent cursor-zoom-in hover:ring-2 hover:ring-emerald-400/50 transition-all duration-200"
                loading="lazy"
                onClick={() => openLightbox(0)}
              />
            </div>

            <div className="flex flex-col justify-center gap-5">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold font-heading text-primary-900 dark:text-primary-50">
                  {p("name.value")}
                </h3>
                <span className="text-sm font-mono text-primary-500 dark:text-primary-400 shrink-0">
                  {p("date.value")}
                </span>
              </div>

              <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
                {p("description.value")}
              </p>

              <p className="text-primary-700 dark:text-primary-300 leading-relaxed">
                {p("details.value")}
              </p>

              {linkHref && (
                <a
                  href={linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 self-start px-6 py-3 rounded-full border border-emerald-400/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white hover:border-transparent transition-all font-medium text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none">
                  {linkValue || tProjects("open")}
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              )}

              {imageData.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {imageData.map((img, index) => (
                    <img
                      key={img.src}
                      src={img.src}
                      alt={img.alt}
                      width={+img.width}
                      height={+img.height}
                      className="rounded-lg object-contain w-full h-auto cursor-zoom-in hover:ring-2 hover:ring-emerald-400/50 transition-all duration-200 bg-white dark:bg-transparent"
                      loading="lazy"
                      onClick={() => openLightbox(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
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
