import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollRestoration } from "react-router-dom";
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
          className="flex items-center justify-center w-12 h-12 cursor-pointer select-none focus:ring-2 focus:ring-amber-400 focus:outline-none rounded-full m-4 backdrop-blur-lg bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10"
          onClick={() => setIsMenuOpen((state) => !state)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}>
          {isMenuOpen ? (
            <X size={20} className="text-primary-900 dark:text-primary-50" />
          ) : (
            <Menu size={20} className="text-primary-900 dark:text-primary-50" />
          )}
        </button>
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
