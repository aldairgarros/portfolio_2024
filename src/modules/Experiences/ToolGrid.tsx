import { SkillIcon } from "@/components/SkillIcon";
import { type ToolItem } from "@/modules/Experiences/types";

interface ToolGridProps {
  tools: ToolItem[];
}

export function ToolGrid({ tools }: ToolGridProps) {
  const imgSize = tools.length <= 6 ? 72 : 48;

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(72px,1fr))] gap-5">
      {tools.map((tool) => (
        <div key={tool.id} className="flex flex-col items-center gap-2 text-center">
          <SkillIcon
            imageSrc={tool.imageSrc}
            width={imgSize}
            height={imgSize}
            className={`size-${imgSize / 4}`}
          />
          <span className="text-sm sm:text-lg leading-tight">{tool.label}</span>
        </div>
      ))}
    </div>
  );
}
