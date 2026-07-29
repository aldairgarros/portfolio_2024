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
      {/* Perspective Grid Floor */}
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

      {/* Horizontal stripes — scanning down (120px spacing, 1px line, 10s) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent 0px, transparent 119px, rgb(128 128 128 / 0.015) 119px, rgb(128 128 128 / 0.015) 120px)",
          backgroundSize: "100% 120px",
          animation: prefersReducedMotion ? "none" : "scan-down 10s linear infinite",
        }}
      />

      {/* Horizontal stripes — scanning up (45px spacing, 3px line, 5s) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(transparent 0px, transparent 42px, rgb(128 128 128 / 0.025) 42px, rgb(128 128 128 / 0.025) 45px)",
          backgroundSize: "100% 45px",
          animation: prefersReducedMotion ? "none" : "scan-up 5s linear infinite",
        }}
      />

      {/* Vertical stripes — scanning left (70px spacing, 2px line, 7s) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 68px, rgb(128 128 128 / 0.02) 68px, rgb(128 128 128 / 0.02) 70px)",
          backgroundSize: "70px 100%",
          animation: prefersReducedMotion ? "none" : "scan-left 7s linear infinite",
        }}
      />

      {/* Vertical stripes — scanning right (35px spacing, 1px line, 4s) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0px, transparent 34px, rgb(128 128 128 / 0.015) 34px, rgb(128 128 128 / 0.015) 35px)",
          backgroundSize: "35px 100%",
          animation: prefersReducedMotion ? "none" : "scan-right 4s linear infinite",
        }}
      />
    </div>
  );
}
