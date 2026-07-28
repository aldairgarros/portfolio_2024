import { useScroll, useTransform, useMotionValue, useSpring, motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * 2);
      y.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    if (window.matchMedia("(pointer: fine)").matches) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return { x, y };
}

interface BuildingData {
  left: string;
  width: number;
  height: string;
  tapered: boolean;
}

const BUILDINGS_BG: BuildingData[] = [
  { left: "3%", width: 28, height: "100%", tapered: true },
  { left: "15%", width: 32, height: "100%", tapered: false },
  { left: "28%", width: 26, height: "100%", tapered: true },
  { left: "40%", width: 30, height: "100%", tapered: false },
  { left: "52%", width: 28, height: "100%", tapered: true },
  { left: "64%", width: 32, height: "100%", tapered: false },
  { left: "76%", width: 26, height: "100%", tapered: true },
  { left: "88%", width: 30, height: "100%", tapered: false },
];

const BUILDINGS_MID: BuildingData[] = [
  { left: "8%", width: 55, height: "100%", tapered: true },
  { left: "23%", width: 60, height: "100%", tapered: false },
  { left: "38%", width: 55, height: "100%", tapered: true },
  { left: "53%", width: 65, height: "100%", tapered: false },
  { left: "68%", width: 55, height: "100%", tapered: true },
  { left: "83%", width: 60, height: "100%", tapered: false },
];

const BUILDINGS_FG: BuildingData[] = [
  { left: "1%", width: 100, height: "100%", tapered: true },
  { left: "25%", width: 120, height: "100%", tapered: false },
  { left: "47%", width: 110, height: "100%", tapered: true },
  { left: "67%", width: 130, height: "100%", tapered: false },
  { left: "88%", width: 100, height: "100%", tapered: true },
];

function Building({ data, lightColor, darkColor }: { data: BuildingData; lightColor: string; darkColor: string }) {
  const clipPath = data.tapered ? "polygon(0% 100%, 0% 50%, 50% 3%, 100% 50%, 100% 100%)" : undefined;

  return (
    <div className="absolute bottom-0" style={{ left: data.left, width: data.width, height: data.height }}>
      <div className="w-full h-full dark:hidden" style={{ background: lightColor, clipPath }} />
      <div className="w-full h-full hidden dark:block" style={{ background: darkColor, clipPath }} />
    </div>
  );
}

export function BackgroundDecoration() {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMousePosition().x;

  const { scrollYProgress } = useScroll();
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 6]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const fgY = useTransform(scrollYProgress, [0, 1], [0, 35]);

  const bgX = useSpring(useTransform(mouseX, [-1, 1], [-5, 5]), { stiffness: 40, damping: 25 });
  const midX = useSpring(useTransform(mouseX, [-1, 1], [-14, 14]), { stiffness: 50, damping: 20 });
  const fgX = useSpring(useTransform(mouseX, [-1, 1], [-28, 28]), { stiffness: 60, damping: 18 });

  const gridStyle = {
    transform: "rotateX(72deg)",
    width: "300%",
    height: "400%",
    position: "absolute" as const,
    top: "20%",
    left: "-100%",
    backgroundSize: "60px 60px",
  };

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Layer 1: Perspective Grid Floor */}
      <div style={{ perspective: "800px", perspectiveOrigin: "50% 40%" }} className="absolute inset-0 dark:hidden">
        <motion.div
          style={{
            ...gridStyle,
            y: prefersReducedMotion ? 0 : gridY,
            backgroundImage:
              "linear-gradient(rgb(0 0 0 / 0.045) 1px, transparent 1px), linear-gradient(90deg, rgb(0 0 0 / 0.045) 1px, transparent 1px)",
          }}
        />
      </div>
      <div style={{ perspective: "800px", perspectiveOrigin: "50% 40%" }} className="absolute inset-0 hidden dark:block">
        <motion.div
          style={{
            ...gridStyle,
            y: prefersReducedMotion ? 0 : gridY,
            backgroundImage:
              "linear-gradient(rgb(255 255 255 / 0.03) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.03) 1px, transparent 1px)",
          }}
        />
      </div>

      {/* Layer 2: 3D City Skyline — Background Plane */}
      {!prefersReducedMotion && (
        <motion.div className="absolute inset-x-0 bottom-0 h-full" style={{ x: bgX, y: bgY }}>
          {BUILDINGS_BG.map((b, i) => (
            <Building key={i} data={b} lightColor="var(--color-primary-200)" darkColor="var(--color-primary-800)" />
          ))}
        </motion.div>
      )}

      {/* Layer 2: 3D City Skyline — Midground Plane */}
      {!prefersReducedMotion && (
        <motion.div className="absolute inset-x-0 bottom-0 h-full" style={{ x: midX, y: midY }}>
          {BUILDINGS_MID.map((b, i) => (
            <Building key={i} data={b} lightColor="var(--color-primary-300)" darkColor="var(--color-primary-700)" />
          ))}
        </motion.div>
      )}

      {/* Layer 2: 3D City Skyline — Foreground Plane */}
      {!prefersReducedMotion && (
        <motion.div className="absolute inset-x-0 bottom-0 h-full" style={{ x: fgX, y: fgY }}>
          {BUILDINGS_FG.map((b, i) => (
            <Building key={i} data={b} lightColor="var(--color-primary-400)" darkColor="var(--color-primary-600)" />
          ))}
        </motion.div>
      )}

      {/* Layer 3: Metallic Grain */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
        <filter id="mesh-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#mesh-noise)" />
      </svg>

      {/* Layer 4: Scan Lines */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0"
          animate={{ y: ["0%", "60px"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent 0px, transparent 57px, rgb(128 128 128 / 0.015) 57px, rgb(128 128 128 / 0.015) 60px)",
            backgroundSize: "100% 60px",
          }}
        />
      )}
    </div>
  );
}
