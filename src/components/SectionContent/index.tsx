import { type ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionContentVariant = "stack" | "grid";

const VARIANTS: Record<SectionContentVariant, string> = {
  stack: "mx-auto flex flex-col gap-16 max-w-7xl",
  grid: "grid grid-cols-1 gap-2 sm:gap-4 max-w-7xl mx-auto scroll-mt-16",
};

interface SectionContentProps {
  variant?: SectionContentVariant;
  className?: string;
  children: ReactNode;
}

export function SectionContent({
  variant = "stack",
  className = "",
  children,
}: SectionContentProps) {
  return <div className={cn(VARIANTS[variant], className)}>{children}</div>;
}
