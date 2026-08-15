import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useActiveSection } from "@/context/ActiveSectionContext";
import { fadeUpVariants } from "@/lib/motion";
import { cn } from "@/lib/cn";

type SectionItemTrigger = "scroll" | "inherit";

interface SectionItemProps {
  id: string;
  path: string;
  delay?: number;
  trigger?: SectionItemTrigger;
  className?: string;
  children: ReactNode;
}

export function SectionItem({
  id,
  path,
  delay,
  trigger = "scroll",
  className = "",
  children,
}: SectionItemProps) {
  const sectionRef = useActiveSection(path);
  const selfAnimated = trigger === "scroll";

  return (
    <motion.div
      id={id}
      ref={sectionRef}
      variants={fadeUpVariants}
      initial={selfAnimated ? "hidden" : undefined}
      whileInView={selfAnimated ? "visible" : undefined}
      viewport={selfAnimated ? { once: true, margin: "-80px" } : undefined}
      transition={delay !== undefined ? { delay } : undefined}
      className={cn("scroll-mt-16", className)}
    >
      {children}
    </motion.div>
  );
}
