import { GlassCard } from "@/components/GlassCard";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";

export function Hero() {
  const { t } = useTranslation("translation", { keyPrefix: "hero" });
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
      className="flex flex-col items-center justify-center max-h-256 h-screen px-4 text-center"
      onMouseMove={handleMouseMove}>
      <motion.div
        style={{ y: prefersReducedMotion ? 0 : heroY, opacity: prefersReducedMotion ? 1 : heroOpacity }}
        className="relative">
        <div className="relative">
          <motion.h1
            className="text-6xl sm:text-8xl font-bold font-heading tracking-tight text-primary-900 dark:text-primary-50 mb-6"
            style={{ x: prefersReducedMotion ? 0 : springX, y: prefersReducedMotion ? 0 : springY }}>
            {t("title.value")}
          </motion.h1>
          <div className="mt-8 flex justify-center">
            <p className="text-lg sm:text-xl text-primary-600 dark:text-primary-400 max-w-2xl mx-auto leading-relaxed">
              {t("subtitle.value")}
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <GlassCard className="inline-flex items-center gap-2 px-5 py-2 border-accent-500/30">
              <span className="text-accent-600 dark:text-accent-400 text-sm font-semibold">{t("extras.available.label")}</span>
            </GlassCard>
            <GlassCard className="inline-flex items-center gap-2 px-5 py-2 border-accent-500/30">
              <span className="text-accent-600 dark:text-accent-400 text-sm font-semibold">
                {t("extras.artificialIntelligence.label")}
              </span>
            </GlassCard>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
