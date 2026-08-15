import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface CardLabelProps {
  className?: string;
  children: ReactNode;
}

export function CardLabel({ className = "", children }: CardLabelProps) {
  return (
    <p
      className={cn(
        "font-heading font-extrabold text-lg sm:text-2xl uppercase tracking-wider text-zinc-900 dark:text-zinc-100 text-center mb-4",
        className,
      )}
    >
      {children}
    </p>
  );
}
