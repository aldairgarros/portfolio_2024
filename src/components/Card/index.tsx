import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Shade = "white" | "soft" | "gray" | "green";

const SECTION_SHADES: Record<Shade, string> = {
  white: "bg-white dark:bg-zinc-900",
  soft: "bg-zinc-50 dark:bg-zinc-950",
  gray: "bg-zinc-100 dark:bg-zinc-900",
  green: "bg-emerald-50 dark:bg-emerald-950",
};

interface CardProps {
  shade?: Shade;
  className?: string;
  children: ReactNode;
}

export function Card({ shade = "soft", className = "", children }: CardProps) {
  return (
    <div
      className={cn(
        "font-sans rounded-none shadow-md p-6 sm:p-8",
        `${SECTION_SHADES[shade]} text-zinc-900 dark:text-zinc-100 border border-zinc-200/70 dark:border-zinc-800/60`,
        className,
      )}
    >
      {children}
    </div>
  );
}
