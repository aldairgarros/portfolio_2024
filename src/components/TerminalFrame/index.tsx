import { type ReactNode, type Ref } from "react";

const FRAME =
  "border border-zinc-400/80 dark:border-zinc-600/70 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md " +
  "shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_24px_rgba(16,185,129,0.06)]";

interface TerminalFrameProps {
  title?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function TerminalFrame({ title, className = "", children }: TerminalFrameProps) {
  return (
    <div className={`font-mono ${FRAME} ${className}`}>
      {title && (
        <div className="flex items-center border-b border-zinc-400/80 dark:border-zinc-600/70 bg-zinc-100/70 dark:bg-zinc-800/40 px-4 py-2.5">
          <span className="font-bold text-base text-emerald-600 dark:text-emerald-400 whitespace-nowrap min-w-0 truncate">
            {title}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

const PANEL =
  "border border-zinc-400/80 dark:border-zinc-600/70 bg-white/80 dark:bg-zinc-900/60 backdrop-blur-md " +
  "shadow-[0_2px_12px_rgba(0,0,0,0.07)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.32)]";

interface TerminalPanelProps {
  title: ReactNode;
  className?: string;
  children: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

export function TerminalPanel({ title, className = "", children, ref }: TerminalPanelProps) {
  return (
    <div ref={ref} className={`font-mono ${PANEL} ${className}`}>
      <div className="flex items-center gap-2 border-b border-zinc-400/80 dark:border-zinc-600/70 bg-zinc-100/70 dark:bg-zinc-800/40 px-4 py-2.5 min-w-0">
        <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 whitespace-nowrap min-w-0 truncate">
          {title}
        </span>
        <span className="flex-1 border-t border-zinc-400/60 dark:border-zinc-600/50" aria-hidden="true" />
      </div>
      <div className="p-5 sm:p-6 font-sans">{children}</div>
    </div>
  );
}

export function TerminalSeparator() {
  return <div className="border-t border-zinc-400/80 dark:border-zinc-600/70" aria-hidden="true" />;
}
