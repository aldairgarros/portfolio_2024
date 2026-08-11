import { type ReactNode } from "react";

const GLYPH = "text-emerald-500 dark:text-emerald-400";

interface TerminalFrameProps {
  title?: string;
  className?: string;
  children: ReactNode;
}

function Title({ title }: { title: ReactNode }) {
  return (
    <span className={`${GLYPH} font-semibold whitespace-nowrap flex-none min-w-0 max-w-[55%] overflow-hidden text-ellipsis`}>
      <span className="px-1">`</span>
      {title}
      <span className="px-1">`</span>
    </span>
  );
}

export function TerminalFrame({ title, className = "", children }: TerminalFrameProps) {
  return (
    <div className={`font-mono ${className}`}>
      <div aria-hidden className="flex items-center select-none text-sm leading-none">
        <span className={GLYPH}>┌</span>
        <span className={GLYPH}>─</span>
        {title && <Title title={title} />}
        <span className={`flex-1 min-w-0 overflow-hidden whitespace-nowrap ${GLYPH}`}>
          {"─".repeat(600)}
        </span>
        <span className={GLYPH}>┐</span>
      </div>
      <div className="relative flex">
        <span
          aria-hidden
          className={`absolute top-0 bottom-0 left-0 w-[2ch] overflow-hidden select-none text-sm leading-none ${GLYPH}`}
          style={{ wordBreak: "break-all" }}>
          {"│".repeat(999)}
        </span>
        <div className="flex-1 min-w-0 ml-[2ch] mr-[2ch]">{children}</div>
        <span
          aria-hidden
          className={`absolute top-0 bottom-0 right-0 w-[2ch] overflow-hidden select-none text-sm leading-none ${GLYPH}`}
          style={{ wordBreak: "break-all" }}>
          {"│".repeat(999)}
        </span>
      </div>
      <div aria-hidden className="flex items-center select-none text-sm leading-none">
        <span className={GLYPH}>└</span>
        <span className={`flex-1 min-w-0 overflow-hidden whitespace-nowrap ${GLYPH}`}>
          {"─".repeat(600)}
        </span>
        <span className={GLYPH}>┘</span>
      </div>
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
      <div aria-hidden className="flex items-center select-none text-sm leading-none">
        <span className={GLYPH}>├</span>
        <span className={GLYPH}>─</span>
        <Title title={title} />
        <span className={`flex-1 min-w-0 overflow-hidden whitespace-nowrap ${GLYPH}`}>
          {"─".repeat(600)}
        </span>
        <span className={GLYPH}>┤</span>
      </div>
      <div className="px-4 py-5 sm:px-6 sm:py-6">{children}</div>
    </div>
  );
}

export function TerminalSeparator() {
  return (
    <div aria-hidden className="flex items-center select-none text-sm leading-none">
      <span className={GLYPH}>├</span>
      <span className={`flex-1 min-w-0 overflow-hidden whitespace-nowrap ${GLYPH}`}>
        {"─".repeat(600)}
      </span>
      <span className={GLYPH}>┤</span>
    </div>
  );
}
