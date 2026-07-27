import { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function GlassCard({ children, hover = false, className = "", ...rest }: Props) {
  return (
    <div
      className={`backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl shadow-xl p-6 ${
        hover ? "hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300" : ""
      } ${className}`}
      {...rest}>
      {children}
    </div>
  );
}
