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

interface NodeData {
  x: number;
  y: number;
  delay: number;
  dur: number;
}

const NODES: NodeData[] = Array.from({ length: 20 }, () => ({
  x: 5 + Math.random() * 90,
  y: 5 + Math.random() * 90,
  delay: Math.random() * 3,
  dur: 3 + Math.random() * 4,
}));

const POLYLINES: { points: [number, number][]; }[] = [
  { points: [[15, 20], [35, 20], [35, 15], [55, 15], [55, 25]] },
  { points: [[75, 18], [75, 25], [65, 25], [65, 55]] },
  { points: [[45, 50], [45, 35], [40, 35], [40, 60]] },
  { points: [[25, 60], [25, 50], [10, 50], [10, 55]] },
  { points: [[50, 72], [50, 85], [55, 85]] },
  { points: [[70, 68], [80, 68], [80, 80]] },
  { points: [[8, 35], [15, 35], [15, 20]] },
  { points: [[85, 15], [90, 15], [90, 45]] },
  { points: [[30, 88], [50, 88], [50, 72]] },
  { points: [[75, 58], [75, 68], [70, 68]] },
  { points: [[20, 75], [20, 55], [10, 55]] },
  { points: [[60, 42], [60, 25], [55, 25]] },
];

interface BuildingData {
  left: string;
  width: number;
  height: string;
  angled: boolean;
  spine: boolean;
}

const BUILDINGS: BuildingData[] = [
  { left: "1%", width: 70, height: "50%", angled: false, spine: true },
  { left: "6%", width: 55, height: "25%", angled: true, spine: false },
  { left: "10%", width: 90, height: "55%", angled: true, spine: false },
  { left: "18%", width: 60, height: "20%", angled: false, spine: false },
  { left: "22%", width: 100, height: "40%", angled: false, spine: true },
  { left: "31%", width: 75, height: "48%", angled: true, spine: false },
  { left: "37%", width: 50, height: "15%", angled: false, spine: false },
  { left: "40%", width: 110, height: "60%", angled: true, spine: true },
  { left: "50%", width: 65, height: "30%", angled: false, spine: false },
  { left: "55%", width: 85, height: "50%", angled: true, spine: false },
  { left: "62%", width: 70, height: "22%", angled: false, spine: false },
  { left: "67%", width: 95, height: "42%", angled: false, spine: true },
  { left: "75%", width: 55, height: "18%", angled: true, spine: false },
  { left: "78%", width: 100, height: "52%", angled: true, spine: false },
  { left: "87%", width: 60, height: "35%", angled: false, spine: false },
  { left: "91%", width: 80, height: "45%", angled: true, spine: true },
];

function Node({ data }: { data: NodeData }) {
  return (
    <motion.rect
      x={data.x - 4}
      y={data.y - 4}
      width={8}
      height={8}
      transform={`rotate(45 ${data.x} ${data.y})`}
      fill="currentColor"
      initial={{ opacity: 0.06 }}
      animate={{ opacity: [0.06, 0.22, 0.06] }}
      transition={{
        duration: data.dur,
        repeat: Infinity,
        ease: "easeInOut",
        delay: data.delay,
      }}
      style={{ color: "var(--color-primary-500)" }}
    />
  );
}

function Building({ data }: { data: BuildingData }) {
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
          background: "linear-gradient(to top, rgb(0 0 0 / 0.05) 0%, transparent 60%)",
          clipPath,
        }}
      />
      <div
        className="w-full h-full hidden dark:block"
        style={{
          background: "linear-gradient(to top, rgb(255 255 255 / 0.03) 0%, transparent 60%)",
          clipPath,
        }}
      />
      {data.spine && (
        <div className="absolute left-1/2 bottom-full -translate-x-1/2 w-[2px] h-[12%] dark:hidden"
          style={{ background: "rgb(0 0 0 / 0.03)" }}
        />
      )}
      {data.spine && (
        <div className="absolute left-1/2 bottom-full -translate-x-1/2 w-[2px] h-[12%] hidden dark:block"
          style={{ background: "rgb(255 255 255 / 0.02)" }}
        />
      )}
    </div>
  );
}

export function BackgroundDecoration() {
  const prefersReducedMotion = useReducedMotion();
  const { x: mouseX } = useMousePosition();

  const { scrollYProgress } = useScroll();
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const skylineY = useTransform(scrollYProgress, [0, 1], [0, -10]);

  const skyX = useSpring(useTransform(mouseX, [-1, 1], [-8, 8]), { stiffness: 50, damping: 20 });

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

      {/* Layer 1: Perspective Grid Floor — light */}
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

      {/* Layer 1: Perspective Grid Floor — dark */}
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

      {/* Layer 2: Circuit Network */}
      {!prefersReducedMotion && (
        <svg className="absolute inset-0 w-full h-full" style={{ color: "var(--color-primary-500)" }}>
          {POLYLINES.map((poly, i) => (
            <polyline
              key={i}
              points={poly.points.map(([px, py]) => `${px}%,${py}%`).join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              strokeOpacity={0.06}
            />
          ))}
          {NODES.map((node, i) => (
            <Node key={i} data={node} />
          ))}
        </svg>
      )}

      {/* Layer 3: Futuristic City Skyline */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-x-0 bottom-0 h-full"
          style={{ x: skyX, y: skylineY }}
        >
          {BUILDINGS.map((b, i) => (
            <Building key={i} data={b} />
          ))}
        </motion.div>
      )}

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
