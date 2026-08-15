import { cn } from "@/lib/cn";
import { skillImageSrc } from "@/lib/assets";

interface SkillIconProps {
  imageSrc: string;
  className?: string;
  width?: number;
  height?: number;
}

export function SkillIcon({ imageSrc, className = "", width, height }: SkillIconProps) {
  return (
    <img
      src={skillImageSrc(imageSrc)}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      className={cn("object-contain", className)}
    />
  );
}
