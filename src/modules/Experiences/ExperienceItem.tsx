import { ArrowList } from "@/components/ArrowList";
import { Card } from "@/components/Card";
import { CardLabel } from "@/components/CardLabel";
import { SectionHeader } from "@/components/SectionHeader";
import { type ExperienceId } from "@/modules/Experiences/types";
import { useTranslation } from "react-i18next";

interface Props {
  item: ExperienceId;
}

export function ExperienceItem({ item }: Props): React.JSX.Element {
  const { t } = useTranslation("translation", { keyPrefix: "experiences" });

  const workItems = t(`list.${item}.work.items`, { returnObjects: true }) as string[];
  const achievementItems = t(`list.${item}.achievements.items`, {
    returnObjects: true,
  }) as string[];

  return (
    <div className="flex flex-col gap-2 sm:gap-4">
      <SectionHeader
        title={t(`list.${item}.title.value`)}
        subtitle={
          <>
            {t(`list.${item}.start.value`)} &mdash; {t(`list.${item}.end.value`)}
          </>
        }
        description={t(`list.${item}.description.value`)}
        className="flex flex-col gap-2 sm:gap-4 p-3 sm:p-6 text-center"
        titleClassName="text-2xl sm:text-4xl"
        subtitleClassName="text-base sm:text-xl text-zinc-700 dark:text-zinc-300"
      />

      <Card shade="white" className="p-8 sm:p-16">
        <CardLabel>{t(`list.${item}.work.label`)}</CardLabel>
        <ArrowList columns items={workItems} />
      </Card>

      <Card shade="green" className="p-8 sm:p-16">
        <CardLabel>{t(`list.${item}.achievements.label`)}</CardLabel>
        <ArrowList columns items={achievementItems} />
      </Card>
    </div>
  );
}
