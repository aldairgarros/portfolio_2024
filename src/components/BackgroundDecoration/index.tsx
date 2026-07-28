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
  angled: boolean;
  spine: boolean;
}

const BUILDINGS_BG: BuildingData[] = [
  { left: "2%", width: 50, height: "18%", angled: false, spine: false },
  { left: "8%", width: 65, height: "25%", angled: false, spine: false },
  { left: "15%", width: 45, height: "20%", angled: true, spine: false },
  { left: "22%", width: 70, height: "28%", angled: false, spine: false },
  { left: "30%", width: 55, height: "22%", angled: true, spine: false },
  { left: "38%", width: 60, height: "16%", angled: false, spine: false },
  { left: "46%", width: 50, height: "24%", angled: false, spine: false },
  { left: "55%", width: 65, height: "20%", angled: true, spine: false },
  { left: "63%", width: 45, height: "26%", angled: false, spine: false },
  { left: "70%", width: 55, height: "18%", angled: false, spine: false },
  { left: "78%", width: 60, height: "23%", angled: true, spine: false },
  { left: "86%", width: 50, height: "28%", angled: false, spine: false },
  { left: "92%", width: 65, height: "20%", angled: false, spine: false },
];

const BUILDINGS_MID: BuildingData[] = [
  { left: "5%", width: 70, height: "35%", angled: true, spine: false },
  { left: "13%", width: 80, height: "42%", angled: false, spine: false },
  { left: "20%", width: 60, height: "30%", angled: false, spine: false },
  { left: "28%", width: 90, height: "45%", angled: true, spine: true },
  { left: "36%", width: 75, height: "35%", angled: false, spine: false },
  { left: "45%", width: 85, height: "48%", angled: true, spine: false },
  { left: "53%", width: 65, height: "32%", angled: false, spine: false },
  { left: "60%", width: 95, height: "50%", angled: true, spine: true },
  { left: "72%", width: 70, height: "38%", angled: false, spine: false },
  { left: "80%", width: 80, height: "44%", angled: true, spine: false },
  { left: "88%", width: 75, height: "35%", angled: false, spine: false },
];

const BUILDINGS_FG: BuildingData[] = [
  { left: "3%", width: 100, height: "65%", angled: false, spine: true },
  { left: "16%", width: 85, height: "50%", angled: true, spine: false },
  { left: "24%", width: 120, height: "70%", angled: false, spine: true },
  { left: "38%", width: 90, height: "55%", angled: true, spine: false },
  { left: "48%", width: 110, height: "60%", angled: false, spine: true },
  { left: "62%", width: 100, height: "68%", angled: true, spine: false },
  { left: "74%", width: 120, height: "55%", angled: false, spine: true },
  { left: "88%", width: 95, height: "62%", angled: true, spine: false },
];

function Building({ data, lightOp, darkOp }: { data: BuildingData; lightOp: number; darkOp: number }) {
  const clipPath = data.angled
    ? "polygon(0% 100%, 0% 25%, 50% 0%, 100% 25%, 100% 100%)"
    : undefined;

  return (
    <div
      className="absolute bottom-0"
      style={{ left: data.left, width: data.width, height: data.height }}
    >
      <div
        className="w-full h-full dark:hidden"
        style={{
          background: `linear-gradient(to top, rgb(0 0 0 / ${lightOp}) 0%, transparent 60%)`,
          clipPath,
        }}
      />
      <div
        className="w-full h-full hidden dark:block"
        style={{
          background: `linear-gradient(to top, rgb(255 255 255 / ${darkOp}) 0%, transparent 60%)`,
          clipPath,
        }}
      />
      {data.spine && (
        <div className="absolute left-1/2 bottom-full -translate-x-1/2 w-[2px] h-[15%] dark:hidden"
          style={{ background: `rgb(0 0 0 / ${lightOp})` }}
        />
      )}
      {data.spine && (
        <div className="absolute left-1/2 bottom-full -translate-x-1/2 w-[2px] h-[15%] hidden dark:block"
          style={{ background: `rgb(255 255 255 / ${darkOp})` }}
        />
      )}
    </div>
  );
}

export function BackgroundDecoration() {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMousePosition().x;

  const { scrollYProgress } = useScroll();
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -5]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const fgY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  const bgX = useSpring(useTransform(mouseX, [-1, 1], [-3, 3]), { stiffness: 40, damping: 25 });
  const midX = useSpring(useTransform(mouseX, [-1, 1], [-7, 7]), { stiffness: 50, damping: 20 });
  const fgX = useSpring(useTransform(mouseX, [-1, 1], [-14, 14]), { stiffness: 60, damping: 18 });

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
            <Building key={i} data={b} lightOp={0.018} darkOp={0.012} />
          ))}
        </motion.div>
      )}

      {/* Layer 2: 3D City Skyline — Midground Plane */}
      {!prefersReducedMotion && (
        <motion.div className="absolute inset-x-0 bottom-0 h-full" style={{ x: midX, y: midY }}>
          {BUILDINGS_MID.map((b, i) => (
            <Building key={i} data={b} lightOp={0.035} darkOp={0.02} />
          ))}
        </motion.div>
      )}

      {/* Layer 2: 3D City Skyline — Foreground Plane */}
      {!prefersReducedMotion && (
        <motion.div className="absolute inset-x-0 bottom-0 h-full" style={{ x: fgX, y: fgY }}>
          {BUILDINGS_FG.map((b, i) => (
            <Building key={i} data={b} lightOp={0.055} darkOp={0.03} />
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
