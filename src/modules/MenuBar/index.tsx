import { useEffect, useState } from "react";
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
  const { i18n, t } = useTranslation();
  const { language, changeLanguage } = i18n;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
  };

  return (
    <>
      <ScrollRestoration />
      <nav
        className="fixed top-0 w-full z-30 border-b border-zinc-200/30 dark:border-zinc-700/20 backdrop-blur-lg bg-white/10 dark:bg-white/5"
        role="navigation"
        aria-label="Main navigation">
        <div className="max-w-6xl mx-auto h-14 flex items-center justify-between px-4 sm:px-8">
          <Link
            to={{ pathname: "/", hash: "hero" }}
            className="flex items-center gap-2 focus:ring-2 focus:ring-emerald-400 focus:outline-none rounded">
            <span className="font-mono text-sm font-semibold text-emerald-500 dark:text-emerald-400">&gt;_</span>
            <span className="font-heading font-medium text-primary-900 dark:text-primary-50">
              {t("hero.title.value")}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-primary-300 dark:border-primary-600 overflow-hidden">
              {(["en", "br"] as const).map((lang) => (
                <button
                  key={lang}
                  className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                    language === lang
                      ? "bg-emerald-500 text-white"
                      : "text-primary-600 dark:text-primary-400 hover:text-emerald-500 dark:hover:text-emerald-400"
                  }`}
                  onClick={() => handleLanguageChange(lang)}
                  aria-label={lang === "en" ? t("home.langEn") : t("home.langBr")}
                  aria-pressed={language === lang}>
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-emerald-400/40 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors font-mono text-sm cursor-pointer select-none focus:ring-2 focus:ring-emerald-400 focus:outline-none"
              onClick={() => setIsMenuOpen((state) => !state)}
              aria-label={isMenuOpen ? t("home.menuClose") : t("home.menuOpen")}
              aria-expanded={isMenuOpen}>
              <span>&gt;_</span>
              <span className={isMenuOpen ? "" : "animate-pulse"}>█</span>
            </button>
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
