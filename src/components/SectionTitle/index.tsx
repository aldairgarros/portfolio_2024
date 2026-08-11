import { type LucideIcon } from "lucide-react";

interface Props {
  title: string;
  id?: string;
  icon?: LucideIcon;
}

export function SectionTitle({ title, id, icon: Icon }: Props) {
  return (
    <div className="mb-16">
      <h2
        id={id}
        className="text-5xl sm:text-7xl font-bold font-heading text-primary-900 dark:text-primary-50 flex items-center gap-3">
        {Icon && <Icon size={32} className="text-amber-400 shrink-0" />}
        {title}
      </h2>
      <div className="mt-3 h-1 w-24 bg-gradient-to-r from-amber-400 via-rose-400 to-amber-400 rounded-full" />
    </div>
  );
}
