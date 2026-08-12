import { useTranslation } from "react-i18next";

interface Props {
  expertise: string;
  skill: string;
}

export function Skill({ expertise, skill }: Props): React.JSX.Element {
  const { t } = useTranslation("translation", { keyPrefix: "expertise" });

  return (
    <div className="inline-flex items-center gap-1.5 border border-zinc-300/70 dark:border-zinc-700/60 px-2.5 py-1.5 font-mono text-xs text-primary-600 dark:text-primary-400 cursor-default">
      <img
        src={`skill_images/${t(`list.${expertise}.list.${skill}.imageSrc`)}`}
        alt=""
        width={16}
        height={16}
        loading="lazy"
        className="w-4 h-4 object-contain grayscale"
      />
      <span className="leading-none">{t(`list.${expertise}.list.${skill}.label`)}</span>
    </div>
  );
}
