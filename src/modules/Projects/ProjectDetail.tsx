import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
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

  const stripRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = stripRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = stripRef.current;
    if (!el) return;
    const card = el.querySelector("img");
    const step = card ? card.getBoundingClientRect().width + 12 : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [updateScrollState]);

  return (
    <div id={project}>
      <h3 className="sr-only">{p("name.value")}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="order-2 md:order-1 relative flex flex-col justify-center">
          <div
            ref={stripRef}
            onScroll={updateScrollState}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div aria-hidden="true" className="shrink-0 w-[calc(7.5%-0.75rem)] sm:w-[calc(15%-0.75rem)] md:w-[calc(9%-0.75rem)]" />
            {lightboxImages.map((img, index) => (
              <img
                key={img.src}
                src={img.src}
                alt={img.alt ?? ""}
                loading="lazy"
                onClick={() => openLightbox(index)}
                className="shrink-0 snap-center h-60 sm:h-72 w-[85%] sm:w-[70%] md:w-[82%] object-contain bg-white dark:bg-transparent cursor-zoom-in hover:ring-2 hover:ring-emerald-400/50 transition-all duration-200"
              />
            ))}
            <div aria-hidden="true" className="shrink-0 w-[calc(7.5%-0.75rem)] sm:w-[calc(15%-0.75rem)] md:w-[calc(9%-0.75rem)]" />
          </div>

          <button
            onClick={() => scrollByCard(-1)}
            aria-label="Previous images"
            disabled={!canScrollLeft}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300/70 dark:border-zinc-700/60 text-primary-600 dark:text-primary-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none disabled:opacity-40 disabled:cursor-default disabled:hover:text-primary-600 dark:disabled:hover:text-primary-300">
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            onClick={() => scrollByCard(1)}
            aria-label="Next images"
            disabled={!canScrollRight}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white/80 dark:bg-zinc-900/80 border border-zinc-300/70 dark:border-zinc-700/60 text-primary-600 dark:text-primary-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none disabled:opacity-40 disabled:cursor-default disabled:hover:text-primary-600 dark:disabled:hover:text-primary-300">
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col justify-center gap-5 order-1 md:order-2">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{p("description.value")}</p>

          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{p("details.value")}</p>

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
