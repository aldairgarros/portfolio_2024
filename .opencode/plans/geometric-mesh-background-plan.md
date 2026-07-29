# Geometric Mesh Background — Implementation Plan

**Goal**: Rewrite BackgroundDecoration with 5 angular layers — perspective grid, circuit network, accent bars, metallic grain, scan lines.

**Architecture**: Single component rewrite. All layers rendered in one file. Framer Motion for scroll/mouse animation. SVG + CSS for static patterns.

## Global Constraints
- `tsc -b && vite build` passes
- `noUnusedLocals` and `noUnusedParameters` enforced
- All paths use `@/` alias
- `prefersReducedMotion` disables all animation
- `(pointer: fine)` gates mouse tracking
- `aria-hidden="true"` on container
- Zero rounded shapes anywhere (no `rounded-*`, no `blur-*`, no `border-radius`)

---

## Implementation

Rewrite `src/components/BackgroundDecoration/index.tsx` completely:

```tsx
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
    const canHover = window.matchMedia("(pointer: fine)").matches;
    if (canHover) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return { x, y };
}

const NODES = [
  { x: 15, y: 20 },
  { x: 35, y: 15 },
  { x: 55, y: 25 },
  { x: 75, y: 18 },
  { x: 85, y: 45 },
  { x: 65, y: 55 },
  { x: 45, y: 50 },
  { x: 25, y: 60 },
  { x: 10, y: 55 },
  { x: 20, y: 75 },
  { x: 50, y: 72 },
  { x: 70, y: 68 },
  { x: 55, y: 85 },
  { x: 80, y: 80 },
  { x: 40, y: 35 },
  { x: 90, y: 15 },
  { x: 8, y: 35 },
  { x: 60, y: 42 },
  { x: 30, y: 88 },
  { x: 75, y: 58 },
];

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

function Node({ x, y }: { x: number; y: number }) {
  return (
    <motion.rect
      x={x - 4}
      y={y - 4}
      width={8}
      height={8}
      transform={`rotate(45 ${x} ${y})`}
      fill="currentColor"
      initial={{ opacity: 0.06 }}
      animate={{ opacity: [0.06, 0.22, 0.06] }}
      transition={{
        duration: 3 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: Math.random() * 3,
      }}
      style={{ color: "var(--color-primary-500)" }}
    />
  );
}

export function BackgroundDecoration() {
  const prefersReducedMotion = useReducedMotion();
  const { x: mouseX, y: mouseY } = useMousePosition();

  const { scrollYProgress } = useScroll();
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 15]);

  const bar1X = useSpring(useTransform(mouseX, [-1, 1], [-15, 15]), { stiffness: 60, damping: 18 });
  const bar1Y = useSpring(useTransform(mouseY, [-1, 1], [-15, 15]), { stiffness: 60, damping: 18 });
  const bar2X = useSpring(useTransform(mouseX, [-1, 1], [12, -12]), { stiffness: 60, damping: 18 });
  const bar2Y = useSpring(useTransform(mouseY, [-1, 1], [12, -12]), { stiffness: 60, damping: 18 });

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

      {/* Layer 1: Perspective Grid Floor */}
      <div style={{ perspective: "800px", perspectiveOrigin: "50% 40%" }} className="absolute inset-0">
        <motion.div
          style={{
            y: prefersReducedMotion ? 0 : gridY,
            transform: "rotateX(72deg)",
            width: "300%",
            height: "400%",
            position: "absolute",
            top: "20%",
            left: "-100%",
            backgroundImage: `
              linear-gradient(rgb(0 0 0 / 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgb(0 0 0 / 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Dark mode grid override */}
      <div style={{ perspective: "800px", perspectiveOrigin: "50% 40%" }} className="absolute inset-0 hidden dark:block">
        <motion.div
          style={{
            y: prefersReducedMotion ? 0 : gridY,
            transform: "rotateX(72deg)",
            width: "300%",
            height: "400%",
            position: "absolute",
            top: "20%",
            left: "-100%",
            backgroundImage: `
              linear-gradient(rgb(255 255 255 / 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgb(255 255 255 / 0.03) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Layer 2: Circuit Network */}
      {!prefersReducedMotion && (
        <svg className="absolute inset-0 w-full h-full" style={{ color: "var(--color-primary-500)" }}>
          {/* Polylines */}
          {Array.from({ length: POLYLINES.length }, (_, i) => (
            <polyline
              key={i}
              points={POLYLINES[i].points.map(([px, py]) => `${px}%,${py}%`).join(" ")}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              strokeOpacity={0.06}
              className="dark:stroke-white dark:stroke-[0.04]"
            />
          ))}
          {/* Nodes */}
          {NODES.map((node, i) => (
            <Node key={i} x={node.x} y={node.y} />
          ))}
        </svg>
      )}

      {/* Layer 3: Angular Accent Bars */}
      {!prefersReducedMotion && (
        <>
          <motion.div
            style={{ x: bar1X, y: bar1Y }}
            className="absolute -top-10 -right-20 w-[500px] h-[250px]"
            initial={{ rotate: 32 }}
          >
            <div
              className="w-full h-full"
              style={{
                background: "linear-gradient(135deg, rgb(0 0 0 / 0.06) 0%, transparent 100%)",
                clipPath: "polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)",
              }}
            />
          </motion.div>
          <motion.div
            style={{ x: bar2X, y: bar2Y }}
            className="absolute -bottom-20 -left-10 w-[450px] h-[220px]"
            initial={{ rotate: -48 }}
          >
            <div
              className="w-full h-full"
              style={{
                background: "linear-gradient(225deg, rgb(0 0 0 / 0.06) 0%, transparent 100%)",
                clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 15% 100%)",
              }}
            />
          </motion.div>
        </>
      )}

      {/* Layer 4: Metallic Grain */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
        <filter id="mesh-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#mesh-noise)" />
      </svg>

      {/* Layer 5: Scan Lines */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0"
            animate={{ y: ["0%", "60px"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundImage: "repeating-linear-gradient(transparent 0px, transparent 57px, rgb(128 128 128 / 0.015) 57px, rgb(128 128 128 / 0.015) 60px)",
              backgroundSize: "100% 60px",
              pointerEvents: "none",
            }}
          />
        </div>
      )}

    </div>
  );
}
```

## Verification
- `npm run lint && npm run build` — both must pass
- Visually: perspective grid visible, circuit lines + nodes, angular bars, grain texture, scan lines sweeping
- In dark mode: grid lines and bars visible with inverse opacity
- `prefersReducedMotion`: all animations halt, only grid + grain remain
