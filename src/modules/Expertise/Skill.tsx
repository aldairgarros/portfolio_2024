import { SkillIcon } from "@/components/SkillIcon";
import { useTranslation } from "react-i18next";

interface Props {
  expertise: string;
  skill: string;
}

export function Skill({ expertise, skill }: Props): React.JSX.Element {
  const { t } = useTranslation("translation", { keyPrefix: "expertise" });

  return (
    <span className="inline-flex items-center gap-2.5 rounded-full bg-white dark:bg-black px-5 py-2 font-mono text-sm sm:text-base text-zinc-700 dark:text-zinc-300 cursor-default">
      <SkillIcon imageSrc={t(`list.${expertise}.list.${skill}.imageSrc`)} className="size-4.5" />
      <span className="leading-none">{t(`list.${expertise}.list.${skill}.label`)}</span>
    </span>
  );
}
