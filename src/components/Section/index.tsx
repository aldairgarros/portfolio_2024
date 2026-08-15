import { type ReactNode, type RefCallback } from "react";
import { SectionTitle } from "@/components/SectionTitle";
import { cn } from "@/lib/cn";

interface SectionProps {
  id: string;
  title: ReactNode;
  sectionRef?: RefCallback<HTMLElement>;
  className?: string;
  children: ReactNode;
}

export function Section({ id, title, sectionRef, className = "", children }: SectionProps) {
  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn("py-12 sm:py-24 px-2 sm:px-4 w-full scroll-mt-16", className)}
    >
      <SectionTitle>{title}</SectionTitle>
      {children}
    </section>
  );
}
