import { GlassCard } from "@/components/GlassCard";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, ScrollRestoration } from "react-router-dom";
import { FullScreenMenu } from "./FullScreenMenu";

interface LinkItem {
  label: string;
  hash: string;
}

interface Props {
  links: LinkItem[];
}

export function MenuBar({ links }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { i18n } = useTranslation();
  const { language, changeLanguage } = i18n;

  const updateHtmlLang = (lang: string) => {
    document.documentElement.lang = lang;
  };

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
    updateHtmlLang(lang);
  };

  return (
    <>
      <ScrollRestoration />
      <nav className="fixed top-0 flex justify-end w-full z-30" role="navigation" aria-label="Main navigation">
        <button
          className="sm:hidden flex items-center justify-center w-12 h-12 cursor-pointer select-none focus:ring-2 focus:ring-accent-500 focus:outline-none"
          onClick={() => setIsMenuOpen((state) => !state)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}>
          {isMenuOpen ? (
            <X size={20} className="text-primary-900 dark:text-primary-50" />
          ) : (
            <Menu size={20} className="text-primary-900 dark:text-primary-50" />
          )}
        </button>
        <div className="hidden sm:flex w-full max-w-6xl h-12 mx-auto items-center justify-between px-4">
          <div className="flex items-center py-3 gap-2">
            {links.map((link) => (
              <Link
                key={link.hash}
                className="text-sm font-medium text-primary-700 dark:text-primary-300 hover:text-accent-600 dark:hover:text-accent-400 transition-colors focus:outline-none"
                to={{ pathname: "/", hash: link.hash }}>
                <GlassCard className="inline-flex items-center px-3 py-1 border-accent-500/30">{link.label}</GlassCard>
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            <div className="flex rounded-full border border-primary-300 dark:border-primary-600 overflow-hidden">
              <button
                className={`px-3 py-1 text-xs font-medium transition-colors focus:ring-2 focus:ring-accent-500 focus:outline-none ${
                  language === "en"
                    ? "bg-accent-500 text-white"
                    : "text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200"
                }`}
                onClick={() => handleLanguageChange("en")}
                aria-label="Switch to English"
                aria-pressed={language === "en"}>
                EN
              </button>
              <button
                className={`px-3 py-1 text-xs font-medium transition-colors focus:ring-2 focus:ring-accent-500 focus:outline-none ${
                  language === "br"
                    ? "bg-accent-500 text-white"
                    : "text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-200"
                }`}
                onClick={() => handleLanguageChange("br")}
                aria-label="Mudar para português"
                aria-pressed={language === "br"}>
                BR
              </button>
            </div>
          </div>
        </div>
      </nav>
      <FullScreenMenu
        open={isMenuOpen}
        links={links}
        currentLanguage={language}
        onLanguageChange={handleLanguageChange}
        onClick={() => setIsMenuOpen(false)}
      />
    </>
  );
}
