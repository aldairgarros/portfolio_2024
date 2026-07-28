import { type ComponentPropsWithoutRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

interface Props extends ComponentPropsWithoutRef<typeof motion.div> {
  expertise: string;
  skill: string;
}

export function Skill({ expertise, skill, ...rest }: Props) {
  const { t } = useTranslation("translation", { keyPrefix: "expertise" });
  const prefersReducedMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [2, -2]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-2, 2]), { stiffness: 150, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={prefersReducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 600 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
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
    </motion.div>
  );
}
