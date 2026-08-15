import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface SectionHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  className = "",
  titleClassName = "",
  subtitleClassName = "",
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col text-center", className)}>
      <h3
        className={cn("font-bold tracking-tight text-zinc-900 dark:text-zinc-100", titleClassName)}
      >
        {title}
      </h3>
      {subtitle && <p className={cn("font-mono", subtitleClassName)}>{subtitle}</p>}
      {description && (
        <p className="text-zinc-700 dark:text-zinc-200 text-xl sm:text-2xl font-bold max-w-2xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
