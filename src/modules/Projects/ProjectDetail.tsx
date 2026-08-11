import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink } from "lucide-react";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";

interface Props {
  project: string;
}

export function ProjectDetail({ project }: Props): React.JSX.Element {
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

  const mainSrc = p("image.src");
  const mainAlt = p("image.alt");

  const lightboxImages: LightboxImage[] = [{ src: mainSrc, alt: mainAlt }, ...imageData.map(({ src, alt }) => ({ src, alt }))];

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const linkHref = p("link.href");
  const linkValue = p("link.value");

  return (
    <div id={project}>
      <h3 className="sr-only">{p("name.value")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col justify-center order-2 md:order-1">
          <img
            src={mainSrc}
            alt={mainAlt}
            width={640}
            height={480}
            className="w-full h-auto aspect-[4/3] object-contain bg-white dark:bg-transparent cursor-zoom-in hover:ring-2 hover:ring-emerald-400/50 transition-all duration-200"
            loading="lazy"
            onClick={() => openLightbox(0)}
          />
        </div>

        <div className="flex flex-col justify-center gap-5 order-1 md:order-2">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {p("description.value")}
          </p>

          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {p("details.value")}
          </p>

          {linkHref.startsWith("http") && (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 self-start px-6 py-3 bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none">
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
                  width={240}
                  height={320}
                  className="object-contain w-full h-auto aspect-[3/4] cursor-zoom-in hover:ring-2 hover:ring-emerald-400/50 transition-all duration-200 bg-white dark:bg-transparent"
                  loading="lazy"
                  onClick={() => openLightbox(index + 1)}
                />
              ))}
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
    </div>
  );
}
