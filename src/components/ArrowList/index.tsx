interface ArrowListProps {
  items: string[];
}

export function ArrowList({ items }: ArrowListProps) {
  return (
    <ul className="space-y-3">
      {items.map((entry, i) => (
        <li
          key={i}
          className="flex gap-2 text-base sm:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed"
        >
          <span className="text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true">
            &gt;
          </span>
          <span>{entry}</span>
        </li>
      ))}
    </ul>
  );
}
