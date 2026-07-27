import { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";

interface Props extends HTMLAttributes<HTMLDivElement> {
  expertise: string;
  skill: string;
}

export function Skill({ expertise, skill, ...rest }: Props) {
  const { t } = useTranslation("translation", { keyPrefix: "expertise" });

  return (
    <div
      className="flex flex-col items-center gap-2 p-3 rounded-xl backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/10 dark:border-white/5 hover:scale-110 transition-transform cursor-default w-20"
      {...rest}>
      <img
        src={`skill_images/${t(`list.${expertise}.list.${skill}.imageSrc`)}`}
        alt={t(`list.${expertise}.list.${skill}.label`)}
        width={40}
        height={40}
        className="w-10 h-10 object-contain"
      />
      <span className="text-xs text-center text-primary-700 dark:text-primary-300 leading-tight">
        {t(`list.${expertise}.list.${skill}.label`)}
      </span>
    </div>
  );
}
