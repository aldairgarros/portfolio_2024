import { type ReactNode } from "react";

const FRAME =
  "border border-zinc-300/70 dark:border-zinc-700/60 bg-white/60 dark:bg-primary-900/50 backdrop-blur-md " +
  "shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_24px_rgba(16,185,129,0.06)]";

interface TerminalFrameProps {
  title?: string;
  className?: string;
  children: ReactNode;
}

export function TerminalFrame({ title, className = "", children }: TerminalFrameProps) {
  return (
    <div className={`font-mono ${FRAME} ${className}`}>
      {title && (
        <div className="flex items-center border-b border-zinc-300/70 dark:border-zinc-700/60 px-4 py-2.5">
          <span className="font-bold text-base text-emerald-600 dark:text-emerald-400 whitespace-nowrap min-w-0 truncate">
            <span className="text-emerald-500">`</span>
            {title}
            <span className="text-emerald-500">`</span>
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

interface TerminalPanelProps {
  title: ReactNode;
  className?: string;
  children: ReactNode;
}

export function TerminalPanel({ title, className = "", children }: TerminalPanelProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 min-w-0 px-1 pt-1">
        <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 whitespace-nowrap min-w-0 truncate">
          <span className="text-emerald-500">`</span>
          {title}
          <span className="text-emerald-500">`</span>
        </span>
        <span className="flex-1 border-t border-zinc-300/70 dark:border-zinc-700/60" aria-hidden="true" />
      </div>
      <div className="px-1 py-5">{children}</div>
    </div>
  );
}

export function TerminalSeparator() {
  return <div className="border-t border-zinc-300/70 dark:border-zinc-700/60" aria-hidden="true" />;
}
