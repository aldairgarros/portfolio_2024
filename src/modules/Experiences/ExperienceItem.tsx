import { ArrowList } from "@/components/ArrowList";
import { Card } from "@/components/Card";
import { CardLabel } from "@/components/CardLabel";
import { SectionHeader } from "@/components/SectionHeader";
import { type ExperienceId, type ToolItem } from "@/modules/Experiences/types";
import { ToolGrid } from "@/modules/Experiences/ToolGrid";
import { useTranslation } from "react-i18next";
import { LuTrophy } from "react-icons/lu";

interface Props {
  item: ExperienceId;
}

export function ExperienceItem({ item }: Props): React.JSX.Element {
  const { t } = useTranslation("translation", { keyPrefix: "experiences" });

  const tools: ToolItem[] = Object.entries(
    t(`list.${item}.tools.list`, { returnObjects: true }) as Record<string, ToolItem>,
  ).map(([id, tool]) => ({ id, label: tool.label, imageSrc: tool.imageSrc }));
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

      <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-2 sm:gap-4 max-w-7xl">
        <Card shade="white" className="p-8 sm:p-16">
          <CardLabel>{t(`list.${item}.work.label`)}</CardLabel>
          <ArrowList items={workItems} />
        </Card>

        <Card shade="white" className="p-8 sm:p-16">
          <CardLabel>{t(`list.${item}.tools.label`)}</CardLabel>
          <ToolGrid tools={tools} />
        </Card>
      </div>

      <Card shade="green" className="flex flex-col gap-5 items-center p-8 sm:p-20">
        <CardLabel>{t(`list.${item}.achievements.label`)}</CardLabel>
        <div className="flex flex-col gap-5 items-center">
          <LuTrophy
            size={94}
            className="text-emerald-600 dark:text-emerald-400 shrink-0"
            aria-hidden="true"
          />
          <ArrowList items={achievementItems} />
        </div>
      </Card>
    </div>
  );
}
