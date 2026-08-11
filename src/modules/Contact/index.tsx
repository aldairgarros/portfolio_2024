import { Mail, Phone, MessageCircle, Globe, GitBranch } from "lucide-react";
import { useTranslation } from "react-i18next";

const ICON_MAP: Record<string, typeof Mail> = {
  email: Mail,
  phone: Phone,
  whatsApp: MessageCircle,
  linkedIn: Globe,
  github: GitBranch,
};

const EXTERNAL_KEYS = ["whatsApp", "linkedIn", "github"];

export function ContactFooter() {
  const { t } = useTranslation("translation", { keyPrefix: "contact" });
  const keys = ["email", "phone", "whatsApp", "linkedIn", "github"] as const;

  return (
    <footer className="fixed bottom-0 w-full z-20 backdrop-blur-md bg-white/60 dark:bg-primary-900/60 border-t border-zinc-300/70 dark:border-zinc-700/60 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-6xl mx-auto h-14 flex items-center justify-center sm:justify-between gap-3 px-4 sm:px-8 font-mono text-sm">
        <span className="hidden sm:flex items-center gap-1.5 whitespace-nowrap text-zinc-500 dark:text-zinc-400 select-none">
          <span className="text-emerald-500">contact:</span>
          <span className="animate-pulse text-emerald-500">█</span>
        </span>
        <div className="flex items-center gap-3 sm:gap-5 overflow-x-auto">
          {keys.map((key, index) => {
            const href = t(`list.${key}.href`);
            const value = t(`list.${key}.value`);
            const isExternal = EXTERNAL_KEYS.includes(key);
            const Icon = ICON_MAP[key];

            const extraProps = isExternal
              ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
              : {};

            return (
              <span key={key} className="flex items-center gap-3 sm:gap-5">
                {index > 0 && <span className="text-zinc-400 dark:text-zinc-500" aria-hidden="true">|</span>}
                <a
                  href={href}
                  {...extraProps}
                  aria-label={t(`list.${key}.label`)}
                  className="inline-flex items-center gap-2 whitespace-nowrap text-zinc-700 dark:text-zinc-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none">
                  <Icon size={16} className="shrink-0" />
                  <span className="hidden md:inline">{value}</span>
                </a>
              </span>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
