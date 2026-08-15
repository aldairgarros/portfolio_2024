import { cn } from "@/lib/cn";

interface ArrowListProps {
  items: string[];
  columns?: boolean;
}

export function ArrowList({ items, columns = false }: ArrowListProps) {
  return (
    <ul
      className={cn(
        columns
          ? "grid grid-cols-[repeat(auto-fit,minmax(12rem,20rem))] sm:grid-cols-[repeat(auto-fit,minmax(12rem,14rem))] justify-center gap-x-12 gap-y-4"
          : "space-y-3",
      )}
    >
      {items.map((entry, i) =>
        columns ? (
          <li
            key={i}
            className="relative pt-8 text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed"
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 text-5xl font-bold leading-none text-emerald-600/10 dark:text-emerald-400/10 pointer-events-none select-none"
            >
              &gt;
            </span>
            <span className="relative">{entry}</span>
          </li>
        ) : (
          <li
            key={i}
            className="flex gap-2 text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed"
          >
            <span className="text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true">
              &gt;
            </span>
            <span>{entry}</span>
          </li>
        ),
      )}
    </ul>
  );
}
