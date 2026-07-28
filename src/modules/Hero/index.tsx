import { useTranslation } from "react-i18next";
import { useScroll, useTransform, useMotionValue, useSpring, motion, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/GlassCard";

export function Hero() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const isPointerFine = window.matchMedia("(pointer: fine)").matches;

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 80, damping: 15 });
  const springY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-12, 12]), { stiffness: 80, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !isPointerFine) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center max-h-[1024px] h-screen px-4 text-center"
      onMouseMove={handleMouseMove}
    >
      <motion.div
        style={{ y: prefersReducedMotion ? 0 : heroY, opacity: prefersReducedMotion ? 1 : heroOpacity }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-500/10 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-sm sm:text-base font-medium text-secondary-600 dark:text-secondary-400 mb-4 tracking-widest uppercase">
            {t("hero.title.label")}
          </p>
          <motion.h1
            className="text-6xl sm:text-8xl font-bold font-heading tracking-tight text-primary-900 dark:text-primary-50 mb-6"
            style={{ x: prefersReducedMotion ? 0 : springX, y: prefersReducedMotion ? 0 : springY }}
          >
            {t("hero.title.value")}
          </motion.h1>
          <p className="text-lg sm:text-xl text-primary-600 dark:text-primary-400 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle.value")}
          </p>
          <div className="mt-8 flex justify-center">
            <GlassCard className="inline-flex items-center gap-2 px-5 py-2 border-secondary-500/30">
              <span className="text-secondary-600 dark:text-secondary-400 text-sm font-semibold">
                {t("education.course.institution")}
              </span>
            </GlassCard>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
