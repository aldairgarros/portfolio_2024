import { GlassCard } from "@/components/GlassCard";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";

interface CubeProps {
  size: number;
  speedX: number;
  speedY: number;
}

function Cube({ size, speedX, speedY }: CubeProps) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  useAnimationFrame((time) => {
    if (prefersReducedMotion) return;
    rotateX.set((time / 1000) * speedX);
    rotateY.set((time / 1000) * speedY);
  });

  const half = size / 2;
  const faces = [
    `rotateY(0deg) translateZ(${half}px)`,
    `rotateY(180deg) translateZ(${half}px)`,
    `rotateY(90deg) translateZ(${half}px)`,
    `rotateY(-90deg) translateZ(${half}px)`,
    `rotateX(90deg) translateZ(${half}px)`,
    `rotateX(-90deg) translateZ(${half}px)`,
  ];

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", width: size, height: size }}
      aria-hidden="true">
      {faces.map((transform, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            transform,
            backfaceVisibility: "hidden",
            border: "1px solid rgb(16 185 129 / 0.4)",
            background: "rgb(16 185 129 / 0.04)",
          }}
        />
      ))}
    </motion.div>
  );
}

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
      className="relative flex flex-col items-center justify-center max-h-256 h-screen px-4 text-center overflow-hidden"
      onMouseMove={handleMouseMove}>
      {/* CSS 3D cubes */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 left-[12%] -translate-y-1/2 opacity-20 blur-[1px] hidden sm:block">
          <Cube size={80} speedX={0} speedY={45} />
        </div>
        <div className="absolute top-1/2 right-[12%] -translate-y-1/2 opacity-20 blur-[1px] hidden sm:block">
          <Cube size={110} speedX={35} speedY={55} />
        </div>
      </div>

      <motion.div
        style={{ y: prefersReducedMotion ? 0 : heroY, opacity: prefersReducedMotion ? 1 : heroOpacity }}
        className="relative z-10">
        <div className="relative">
          <motion.h1
            className="text-7xl sm:text-9xl font-bold font-heading tracking-tight text-primary-900 dark:text-primary-50 mb-6"
            style={{ x: prefersReducedMotion ? 0 : springX, y: prefersReducedMotion ? 0 : springY }}>
            {t("title.value")}
          </motion.h1>
          <div className="mt-8 flex justify-center">
            <p className="text-lg sm:text-xl text-primary-600 dark:text-primary-400 max-w-2xl mx-auto leading-relaxed">
              {t("subtitle.value")}
            </p>
          </div>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <GlassCard className="inline-flex items-center gap-2 px-5 py-2 border-emerald-400/40 dark:border-emerald-500/40">
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">{t("extras.available.label")}</span>
            </GlassCard>
            <GlassCard className="inline-flex items-center gap-2 px-5 py-2 border-emerald-400/40 dark:border-emerald-500/40">
              <span className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                {t("extras.artificialIntelligence.label")}
              </span>
            </GlassCard>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
