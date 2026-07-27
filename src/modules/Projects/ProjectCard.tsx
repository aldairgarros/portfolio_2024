import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { GlassCard } from "@/components/GlassCard";

interface ProjectProps extends React.HTMLAttributes<HTMLDivElement> {
  project: string;
}

export function ProjectCard({ project, ...rest }: ProjectProps) {
  const { t } = useTranslation("translation", { keyPrefix: `projects.list.${project}` });
  const { t: tp } = useTranslation("translation", { keyPrefix: "projects" });

  return (
    <GlassCard hover className="overflow-hidden p-0 group" {...rest}>
      <Link to={`/projects/${project}`} className="flex flex-col h-full">
        <div className="relative overflow-hidden bg-primary-100 dark:bg-primary-800">
          <img
            src={t("image.src")}
            alt={t("image.alt")}
            width={600}
            height={400}
            className="w-full h-64 object-contain p-6 group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-50">
              {t("name.value")}
            </h3>
            <span className="text-sm text-primary-500 dark:text-primary-400">
              {t("date.value")}
            </span>
          </div>
          <p className="text-sm text-primary-600 dark:text-primary-400 line-clamp-3">
            {t("overview.value")}
          </p>
          <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-secondary-600 dark:text-secondary-400 group-hover:gap-2 transition-all">
            {tp("open")}
            <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </Link>
    </GlassCard>
  );
}
