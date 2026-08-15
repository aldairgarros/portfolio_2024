import { type ReactNode } from "react";

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-4xl text-center sm:text-6xl font-bold tracking-tight text-primary-900 dark:text-primary-50 sm:mb-8">
      {children}
    </h2>
  );
}
