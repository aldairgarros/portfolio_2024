import { TerminalFrame } from "@/components/TerminalFrame";
import { useActiveSection } from "@/context/ActiveSectionContext";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { LuChevronDown } from "react-icons/lu";
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
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
        width: size,
        height: size,
      }}
      aria-hidden="true"
    >
      {faces.map((transform, index) => (
        <div
          key={index}
          className="absolute inset-0"
          style={{
            transform,
            backfaceVisibility: "visible",
            border: "2px solid rgb(16 185 129 / 0.8)",
            background: "transparent",
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
  const sectionRef = useActiveSection("~");

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -120]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), {
    stiffness: 120,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), {
    stiffness: 120,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion || !isPointerFine) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center max-h-256 h-screen px-4 text-center overflow-hidden bg-accent-100 dark:bg-accent-900"
      onMouseMove={handleMouseMove}
    >
      {/* CSS 3D cubes — spread behind the container */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-[12%] left-[10%] opacity-70 hidden sm:block">
          <Cube size={220} speedX={0} speedY={5} />
        </div>
        <div className="absolute top-[10%] right-[12%] opacity-70 hidden sm:block">
          <Cube size={280} speedX={4} speedY={1} />
        </div>
        <div className="absolute bottom-[10%] left-[18%] opacity-70 hidden md:block">
          <Cube size={170} speedX={-1} speedY={4} />
        </div>
        <div className="absolute bottom-[14%] right-[22%] opacity-60 hidden lg:block">
          <Cube size={120} speedX={2} speedY={-2} />
        </div>
      </div>

      <motion.div
        style={{
          y: prefersReducedMotion ? 0 : heroY,
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformPerspective: 1200,
        }}
        className="relative z-10 w-full max-w-5xl"
      >
        <TerminalFrame
          title={<span className="text-xl sm:text-3xl">~</span>}
          className="relative overflow-hidden"
        >
          <div className="relative z-10 py-10 sm:py-14 px-4 sm:px-8">
            <p className="font-mono text-3xl sm:text-6xl text-emerald-600 dark:text-emerald-400 mb-5">
              {t("title.value")}
            </p>
            <p className="font-sans text-lg sm:text-2xl text-zinc-700 dark:text-zinc-200 max-w-3xl mx-auto leading-relaxed">
              {t("subtitle.value")}
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
              <span className="font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5">
                {t("extras.available.label")}
              </span>
              <span className="font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5">
                {t("extras.artificialIntelligence.label")}
              </span>
            </div>
          </div>
        </TerminalFrame>
      </motion.div>

      <div className="absolute bottom-32 inset-x-0 flex justify-center z-10">
        <motion.button
          type="button"
          onClick={() =>
            document
              .getElementById("credentials")
              ?.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" })
          }
          aria-label={t("scrollDown")}
          className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-400 dark:hover:text-emerald-600 transition-colors cursor-pointer focus:ring-2 focus:ring-emerald-400 focus:outline-none"
          animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
          transition={
            prefersReducedMotion
              ? undefined
              : { repeat: Infinity, duration: 1.6, ease: "easeInOut" }
          }
        >
          <LuChevronDown size={32} aria-hidden="true" />
        </motion.button>
      </div>
    </section>
  );
}
