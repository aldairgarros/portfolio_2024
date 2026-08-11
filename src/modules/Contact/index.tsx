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

const GLYPH = "text-emerald-500 dark:text-emerald-400";

export function ContactFooter() {
  const { t } = useTranslation("translation", { keyPrefix: "contact" });
  const keys = ["email", "phone", "whatsApp", "linkedIn", "github"] as const;

  return (
    <footer className="fixed bottom-0 w-full z-20 backdrop-blur-lg bg-white/10 dark:bg-white/5">
      <div className="flex items-center font-mono text-xs sm:text-sm leading-none overflow-x-auto">
        <span aria-hidden className={`select-none ${GLYPH}`}>└</span>
        <span aria-hidden className={`select-none ${GLYPH}`}>─</span>
        <span className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap text-primary-500 dark:text-primary-400 select-none">
          <span className="text-emerald-500">contact:</span>
          <span className="animate-pulse text-emerald-500">█</span>
        </span>
        <span aria-hidden className={`flex-1 min-w-0 overflow-hidden whitespace-nowrap select-none ${GLYPH}`}>
          {"─".repeat(600)}
        </span>
        <div className="flex items-center gap-2 sm:gap-3 px-1">
          {keys.map((key, index) => {
            const href = t(`list.${key}.href`);
            const value = t(`list.${key}.value`);
            const isExternal = EXTERNAL_KEYS.includes(key);
            const Icon = ICON_MAP[key];

            const extraProps = isExternal
              ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
              : {};

            return (
              <span key={key} className="flex items-center gap-2 sm:gap-3">
                {index > 0 && <span className="text-primary-400 dark:text-primary-500" aria-hidden="true">|</span>}
                <a
                  href={href}
                  {...extraProps}
                  aria-label={t(`list.${key}.label`)}
                  className="inline-flex items-center gap-1.5 whitespace-nowrap text-primary-700 dark:text-primary-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none">
                  <Icon size={14} className="shrink-0" />
                  <span className="hidden md:inline">{value}</span>
                </a>
              </span>
            );
          })}
        </div>
        <span aria-hidden className={`flex-1 min-w-0 overflow-hidden whitespace-nowrap select-none ${GLYPH}`}>
          {"─".repeat(600)}
        </span>
        <span aria-hidden className={`select-none ${GLYPH}`}>┘</span>
      </div>
    </footer>
  );
}
