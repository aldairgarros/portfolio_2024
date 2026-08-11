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
        className="text-4xl sm:text-5xl font-bold font-mono text-primary-900 dark:text-primary-50 flex items-center gap-3">
        {Icon && <Icon size={28} className="text-emerald-400 shrink-0" />}
        <span className="text-emerald-400">`</span>
        <span>{title}</span>
        <span className="text-emerald-400">`</span>
      </h2>
      <div className="mt-3 h-1 w-16 bg-emerald-400" />
    </div>
  );
}
