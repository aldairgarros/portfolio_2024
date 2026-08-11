import { useTranslation } from "react-i18next";

interface Props {
  expertise: string;
  skill: string;
}

export function Skill({ expertise, skill }: Props): React.JSX.Element {
  const { t } = useTranslation("translation", { keyPrefix: "expertise" });

  return (
    <div className="flex flex-col items-center gap-1.5 cursor-default">
      <img
        src={`skill_images/${t(`list.${expertise}.list.${skill}.imageSrc`)}`}
        alt={t(`list.${expertise}.list.${skill}.label`)}
        width={48}
        height={48}
        loading="lazy"
        className="w-12 h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
      />
      <span className="text-xs text-center text-primary-600 dark:text-primary-400 leading-tight">
        {t(`list.${expertise}.list.${skill}.label`)}
      </span>
    </div>
  );
}
