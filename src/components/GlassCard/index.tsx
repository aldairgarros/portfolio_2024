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

  const baseClasses = `relative backdrop-blur-lg bg-white/10 dark:bg-white/5 rounded-3xl shadow-md p-8 before:absolute before:inset-0 before:rounded-3xl before:p-[1px] before:bg-gradient-to-r before:from-amber-400/30 before:to-rose-400/30 dark:before:from-amber-500/20 dark:before:to-rose-500/20 before:[mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)] before:[mask-composite:exclude] before:pointer-events-none ${
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
