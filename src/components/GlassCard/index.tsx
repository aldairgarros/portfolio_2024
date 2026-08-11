import { HTMLAttributes } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

interface Props extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  tilt?: boolean;
}

export function GlassCard({ children, hover = false, tilt = false, className = "", ...rest }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 18 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 120, damping: 18 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tilt || prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    if (!tilt) return;
    x.set(0);
    y.set(0);
  };

  const baseClasses = `relative backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-zinc-200/30 dark:border-zinc-700/20 border-t-2 border-t-zinc-400/50 dark:border-t-zinc-600/50 shadow-md p-6 ${
    hover ? "hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300" : ""
  } ${className}`;

  if (tilt) {
    return (
      <motion.div
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={baseClasses}
        {...(rest as React.ComponentPropsWithoutRef<typeof motion.div>)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...rest}>
      {children}
    </div>
  );
}
