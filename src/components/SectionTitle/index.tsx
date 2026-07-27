interface Props {
  title: string;
  id?: string;
}

export function SectionTitle({ title, id }: Props) {
  return (
    <div className="mb-12">
      <h2
        id={id}
        className="text-3xl sm:text-4xl font-bold text-primary-900 dark:text-primary-50">
        {title}
      </h2>
      <div className="mt-3 h-1 w-16 bg-gradient-to-r from-secondary-500 to-secondary-400 rounded-full" />
    </div>
  );
}
