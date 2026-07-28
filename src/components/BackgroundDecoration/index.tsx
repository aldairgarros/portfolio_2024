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

function useParallaxOffset(multiplier: number) {
  const { scrollYProgress } = useScroll();
  return useTransform(scrollYProgress, [0, 1], [0, multiplier * 100]);
}

export function BackgroundDecoration() {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMousePosition().x;
  const mouseY = useMousePosition().y;

  const blob1X = useSpring(useTransform(mouseX, [-1, 1], [-2, 2]), { stiffness: 80, damping: 20 });
  const blob1Y = useSpring(useTransform(mouseY, [-1, 1], [-2, 2]), { stiffness: 80, damping: 20 });
  const blob2X = useSpring(useTransform(mouseX, [-1, 1], [1.5, -1.5]), { stiffness: 80, damping: 20 });
  const blob2Y = useSpring(useTransform(mouseY, [-1, 1], [1.5, -1.5]), { stiffness: 80, damping: 20 });

  const scrollOffset = useParallaxOffset(-0.2);

  const blobs = [
    { color: "bg-primary-400/10", size: "w-[600px] h-[600px]", top: "-10%", left: "-5%", x: blob1X, y: blob1Y, animDuration: 12 },
    { color: "bg-success-400/10", size: "w-[500px] h-[500px]", top: "40%", right: "-10%", x: blob2X, y: blob2Y, animDuration: 15 },
    { color: "bg-danger-400/10", size: "w-[400px] h-[400px]", top: "60%", left: "30%", x: blob1X, y: blob2Y, animDuration: 10 },
    { color: "bg-warning-400/10", size: "w-[350px] h-[350px]", top: "15%", right: "25%", x: blob2X, y: blob1Y, animDuration: 14 },
  ];

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden">
      {/* Layer 1: Animated blobs */}
      {!prefersReducedMotion && blobs.map((blob, i) => (
        <motion.div key={i} className="absolute" style={{ y: scrollOffset }}>
          <motion.div
            className={`absolute ${blob.size} ${blob.color} blur-3xl rounded-full`}
            style={{
              top: blob.top,
              left: "left" in blob ? blob.left : undefined,
              right: "right" in blob ? blob.right : undefined,
              x: blob.x,
              y: blob.y,
            }}
            animate={{
              x: [0, 30, -20, 10, 0],
              y: [0, -20, 30, -10, 0],
            }}
            transition={{
              duration: blob.animDuration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      ))}

      {/* Layer 2: Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.04,
        }}
      />

      {/* Layer 3: Noise grain */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.035 }}>
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
