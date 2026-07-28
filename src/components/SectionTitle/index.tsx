import { type LucideIcon } from "lucide-react";

interface Props {
  title: string;
  id?: string;
  icon?: LucideIcon;
}

export function SectionTitle({ title, id, icon: Icon }: Props) {
  return (
    <div className="mb-12">
      <h2
        id={id}
        className="text-4xl sm:text-5xl font-bold font-heading text-primary-900 dark:text-primary-50 flex items-center gap-3">
        {Icon && <Icon size={28} className="text-accent-500 shrink-0" />}
        {title}
      </h2>
      <div className="mt-3 h-1 w-16 bg-gradient-to-r from-accent-500 to-accent-400 rounded-full" />
    </div>
  );
}
