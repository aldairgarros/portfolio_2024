import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, ScrollRestoration } from "react-router-dom";
import { TerminalFrame, TerminalSeparator } from "@/components/TerminalFrame";
import { useActivePath } from "@/context/ActiveSectionContext";

export interface NavItem {
  label: string;
  hash: string;
  children?: NavItem[];
}

interface Props {
  links: NavItem[];
}

export function MenuBar({ links }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { i18n, t } = useTranslation();
  const { language, changeLanguage } = i18n;
  const activePath = useActivePath();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMenuOpen]);

  const handleLanguageChange = (lang: string) => {
    changeLanguage(lang);
  };

  return (
    <>
      <ScrollRestoration />
      <nav
        className="fixed top-0 w-full z-30 backdrop-blur-md bg-white/60 dark:bg-primary-900/60 border-b border-zinc-300/70 dark:border-zinc-700/60 shadow-sm"
        role="navigation">
        <div className="max-w-6xl mx-auto h-14 flex items-center justify-between px-4 sm:px-8 font-mono text-base">
          <Link
            to={{ pathname: "/", hash: "hero" }}
            className="font-bold text-emerald-500 dark:text-emerald-400 hover:text-emerald-400 focus:ring-2 focus:ring-emerald-400 focus:outline-none min-w-0 truncate">
            @{t("hero.title.value")}:<span key={activePath ?? "~"} className="animate-fade-in">{activePath ?? "~"}</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex border border-zinc-300/70 dark:border-zinc-700/60 overflow-hidden shadow-sm">
              {(["en", "br"] as const).map((lang) => (
                <button
                  key={lang}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                    language === lang
                      ? "bg-emerald-500 text-white"
                      : "text-primary-600 dark:text-primary-400 hover:text-emerald-500 dark:hover:text-emerald-400"
                  }`}
                  onClick={() => handleLanguageChange(lang)}
                  aria-label={t(lang === "en" ? "home.langEn" : "home.langBr")}
                  aria-pressed={language === lang}>
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center gap-1 px-3 py-2 border border-emerald-500/40 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer select-none focus:ring-2 focus:ring-emerald-400 focus:outline-none shadow-sm"
                onClick={() => setIsMenuOpen((state) => !state)}
                aria-label={isMenuOpen ? t("home.menuClose") : t("home.menuOpen")}
                aria-expanded={isMenuOpen}
                aria-haspopup="menu">
                <span>&gt;_</span>
                <span className={isMenuOpen ? "" : "animate-pulse"}>█</span>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 z-40 bg-white/95 dark:bg-primary-900/95 backdrop-blur-lg">
                  <TerminalFrame>
                    <ul className="py-2" role="menu">
                      {links.map((item) => (
                        <li key={item.hash}>
                          <Link
                            to={{ pathname: "/", hash: item.hash }}
                            className="flex items-center gap-2 px-4 py-2 text-primary-700 dark:text-primary-300 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                            role="menuitem"
                            onClick={() => setIsMenuOpen(false)}>
                            <span className="text-emerald-500">&gt;</span>
                            {item.label}
                          </Link>
                          {item.children && (
                            <ul>
                              {item.children.map((child) => (
                                <li key={child.hash}>
                                  <Link
                                    to={{ pathname: "/", hash: child.hash }}
                                    className="flex items-center gap-2 pl-10 pr-4 py-1.5 text-primary-600 dark:text-primary-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none"
                                    role="menuitem"
                                    onClick={() => setIsMenuOpen(false)}>
                                    <span className="text-emerald-500/70">&gt;</span>
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                    <TerminalSeparator />
                    <div className="px-4 py-3">
                      <div className="flex gap-2">
                        {(["en", "br"] as const).map((lang) => (
                          <button
                            key={lang}
                            className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                              language === lang
                                ? "bg-emerald-500 text-white"
                                : "border border-zinc-300/70 dark:border-zinc-700/60 text-primary-600 dark:text-primary-400"
                            }`}
                            onClick={() => handleLanguageChange(lang)}
                            aria-label={t(lang === "en" ? "home.langEn" : "home.langBr")}
                            aria-pressed={language === lang}>
                            {lang.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </TerminalFrame>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
