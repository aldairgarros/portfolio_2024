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
    <footer className="fixed bottom-0 w-full z-20 backdrop-blur-lg bg-white/10 dark:bg-white/5 border-t-2 border-t-zinc-400/50 dark:border-t-zinc-600/50">
      <div className="max-w-6xl mx-auto h-12 flex items-center justify-center sm:justify-between px-4 sm:px-8 font-mono text-xs sm:text-sm overflow-x-auto">
        <div className="hidden sm:flex items-center gap-2 text-primary-500 dark:text-primary-400">
          <span className="text-emerald-500">contact:</span>
          <span className="animate-pulse">█</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
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
                  className="inline-flex items-center gap-1.5 text-primary-700 dark:text-primary-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none">
                  <Icon size={14} className="shrink-0" />
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
