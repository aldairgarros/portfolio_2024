import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { Lightbox, type LightboxImage } from "@/components/Lightbox";

interface ProjectProps extends React.HTMLAttributes<HTMLDivElement> {
  project: string;
}

export function ProjectCard({ project, ...rest }: ProjectProps) {
  const { t } = useTranslation("translation", { keyPrefix: `projects.list.${project}` });
  const { t: tp } = useTranslation("translation", { keyPrefix: "projects" });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images: LightboxImage[] = (() => {
    const raw = t("images.list", { returnObjects: true }) as Record<string, unknown> | undefined;
    if (!raw) return [];
    return Object.keys(raw)
      .filter((k) => k.startsWith("image"))
      .map((key) => ({
        src: t(`images.list.${key}.src`),
        alt: t(`images.list.${key}.alt`),
      }));
  })();

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLightboxOpen(true);
  }, []);

  return (
    <>
      <GlassCard hover tilt className="overflow-hidden p-0 group" {...rest}>
        <Link to={`/projects/${project}`} className="flex flex-col h-full">
          <div className="relative overflow-hidden">
            <img
              src={t("image.src")}
              alt={t("image.alt")}
              width={600}
              height={400}
              className="w-full h-64 object-contain p-6 group-hover:scale-105 transition-transform duration-300 cursor-zoom-in"
              onClick={handleImageClick}
            />
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold font-heading text-primary-900 dark:text-primary-50">{t("name.value")}</h3>
              <span className="text-sm font-mono text-primary-500 dark:text-primary-400">{t("date.value")}</span>
            </div>
            <p className="text-sm text-primary-600 dark:text-primary-400 line-clamp-3">{t("overview.value")}</p>
            <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-accent-600 dark:text-accent-400 group-hover:gap-2 transition-all">
              {tp("open")}
              <ArrowRight size={14} aria-hidden="true" />
            </span>
          </div>
        </Link>
      </GlassCard>

      {images.length > 0 && <Lightbox images={images} open={lightboxOpen} onClose={() => setLightboxOpen(false)} />}
    </>
  );
}
