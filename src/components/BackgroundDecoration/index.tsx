import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

export function BackgroundDecoration() {
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 15]);

  const gridStyle = {
    transform: "rotateX(72deg)",
    width: "300%",
    height: "400%",
    position: "absolute" as const,
    top: "0%",
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

      {/* Scan line — horizontal stripes scanning downward */}
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

      {/* Scan line — vertical stripes scanning leftward */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0"
          animate={{ x: ["0%", "-60px"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, transparent 0px, transparent 57px, rgb(128 128 128 / 0.015) 57px, rgb(128 128 128 / 0.015) 60px)",
            backgroundSize: "60px 100%",
          }}
        />
      )}

      {/* Grain */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.04 }}>
        <filter id="mesh-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#mesh-noise)" />
      </svg>
    </div>
  );
}
