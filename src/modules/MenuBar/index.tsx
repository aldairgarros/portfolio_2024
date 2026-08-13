import { TerminalFrame } from "@/components/TerminalFrame";
import { useActivePath } from "@/context/ActiveSectionContext";
import { LuChevronDown } from "react-icons/lu";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, ScrollRestoration } from "react-router-dom";

export interface NavItem {
  label: string;
  hash: string;
  children?: NavItem[];
}

interface Props {
  links: NavItem[];
}

const PARENT_CLASS =
  "flex items-center gap-2 px-4 py-2 font-bold uppercase tracking-wider text-primary-900 dark:text-primary-100 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none";

const CHILD_CLASS =
  "flex items-center gap-2 pl-8 pr-4 py-0 text-sm text-primary-500 dark:text-primary-500 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-500/5 transition-colors focus:ring-2 focus:ring-emerald-400 focus:outline-none";

export function MenuBar({ links }: Props) {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { i18n, t } = useTranslation();
  const language = i18n.language;
  const activePath = useActivePath();
  const displayPath = activePath ?? "~";

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
    void i18n.changeLanguage(lang);
  };

  return (
    <>
      <ScrollRestoration />
      <nav
        className="fixed top-0 w-full z-30 backdrop-blur-md bg-white/60 dark:bg-primary-900/60 border-b border-zinc-300/70 dark:border-zinc-700/60 shadow-sm"
        role="navigation"
      >
        <div className="flex max-w-6xl mx-auto h-14 items-center justify-between gap-4 px-4 sm:px-8 font-mono text-base">
          <div className="relative flex-1 min-w-0" ref={menuRef}>
            <button
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 focus:ring-2 focus:ring-emerald-400 focus:outline-none w-full
              flex items-center justify-between gap-1 px-3 py-2 border border-emerald-500/40 dark:border-emerald-500/40 transition-colors cursor-pointer select-none shadow-sm"
              onClick={() => setIsMenuOpen((state) => !state)}
              aria-label={isMenuOpen ? t("home.menuClose") : t("home.menuOpen")}
              aria-expanded={isMenuOpen}
              aria-haspopup="menu"
            >
              @<span className="sm:hidden">{t("hero.title.handle")}</span>
              <span className="hidden sm:inline">{t("hero.title.value")}</span>:
              <span key={displayPath} className="animate-fade-in flex-1 text-left truncate min-w-0">
                {displayPath}
              </span>
              <span>
                <LuChevronDown size={16} />
              </span>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-full z-40 bg-white/95 dark:bg-primary-900/95 backdrop-blur-lg">
                <TerminalFrame>
                  <ul className="py-2" role="menu">
                    <li>
                      <Link
                        to={{ pathname: "/", hash: "" }}
                        className={PARENT_CLASS}
                        role="menuitem"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-emerald-500">&gt;</span>~
                      </Link>
                    </li>
                    {links.map((item) => (
                      <li key={item.hash}>
                        <Link
                          to={{ pathname: "/", hash: item.hash }}
                          className={PARENT_CLASS}
                          role="menuitem"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="text-emerald-500">&gt;</span>
                          {item.label}
                        </Link>
                        {item.children && (
                          <ul>
                            {item.children.map((child, childIndex) => {
                              const isLast = childIndex === item.children!.length - 1;
                              return (
                                <li key={child.hash}>
                                  <Link
                                    to={{ pathname: "/", hash: child.hash }}
                                    className={CHILD_CLASS}
                                    role="menuitem"
                                    onClick={() => setIsMenuOpen(false)}
                                  >
                                    <span className="text-emerald-500/50" aria-hidden="true">
                                      {isLast ? "└─" : "├─"}
                                    </span>
                                    {child.label}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </TerminalFrame>
              </div>
            )}
          </div>

          <div className="flex shrink-0 w-fit min-w-fit border border-zinc-300/70 dark:border-zinc-700/60 overflow-hidden shadow-sm">
            {["en", "br"].map((lang) => (
              <button
                key={lang}
                className={`px-3 py-1.5 text-xs text-center font-medium transition-colors cursor-pointer focus:ring-2 focus:ring-emerald-400 focus:outline-none ${
                  language === lang
                    ? "bg-emerald-500 text-white"
                    : "text-primary-600 dark:text-primary-400 hover:text-emerald-500 dark:hover:text-emerald-400"
                }`}
                onClick={() => handleLanguageChange(lang)}
                aria-label={t(lang === "en" ? "home.langEn" : "home.langBr")}
                aria-pressed={language === lang}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
