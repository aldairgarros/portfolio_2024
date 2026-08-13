import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa6";
import { LuMail, LuPhone } from "react-icons/lu";
import type { IconType } from "react-icons";
import { useTranslation } from "react-i18next";

const ICON_MAP: Record<string, IconType> = {
  email: LuMail,
  phone: LuPhone,
  whatsApp: FaWhatsapp,
  linkedIn: FaLinkedin,
  github: FaGithub,
};

const EXTERNAL_KEYS = ["whatsApp", "linkedIn", "github"];
const TEXT_KEYS = ["email", "phone"];

export function ContactFooter() {
  const { t } = useTranslation("translation", { keyPrefix: "contact" });
  const keys = ["email", "phone", "whatsApp", "linkedIn", "github"] as const;

  return (
    <footer className="fixed bottom-0 w-full z-20 backdrop-blur-md bg-emerald-500/60 dark:bg-emerald-500/60 border-t border-zinc-300/70 dark:border-zinc-700/60 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="max-w-6xl mx-auto h-14 flex items-center justify-center gap-4 sm:gap-6 px-4 sm:px-8 font-mono text-sm">
        {keys.map((key) => {
          const href = t(`list.${key}.href`);
          const value = t(`list.${key}.value`);
          const isExternal = EXTERNAL_KEYS.includes(key);
          const Icon = ICON_MAP[key];

          const extraProps = isExternal
            ? { target: "_blank" as const, rel: "noopener noreferrer" as const }
            : {};

          return (
            <a
              key={key}
              href={href}
              {...extraProps}
              aria-label={t(`list.${key}.label`)}
              title={t(`list.${key}.label`)}
              className="inline-flex items-center gap-2 whitespace-nowrap text-zinc-800 dark:text-zinc-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none"
            >
              <Icon size={16} className="shrink-0" />
              {TEXT_KEYS.includes(key) && <span className="hidden md:inline">{value}</span>}
            </a>
          );
        })}
      </div>
    </footer>
  );
}
