import { HTMLAttributes } from "react";
import { Link } from "react-router-dom";

interface LinkItem {
  label: string;
  hash: string;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  links: LinkItem[];
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export function FullScreenMenu({ open, links, currentLanguage, onLanguageChange, ...rest }: Props) {
  return (
    <div
      className={`fixed inset-0 top-12 bg-white/95 dark:bg-primary-900/95 backdrop-blur-md z-30 overscroll-contain overflow-hidden transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
      {...rest}>
      <div className="flex flex-col gap-6 w-full h-full p-8 pt-12">
        <div className="flex flex-col gap-2">
          {links.map((link, ind) => (
            <Link
              key={link.hash}
              className={`text-2xl font-medium text-primary-900 dark:text-primary-50 hover:text-secondary-600 dark:hover:text-secondary-400 transition-all duration-300 cursor-pointer focus:ring-2 focus:ring-secondary-500 focus:outline-none rounded ${
                open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: `${ind * 50}ms` }}
              to={{ pathname: "/", hash: link.hash }}>
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          {(["en", "br"] as const).map((lang, ind) => (
            <button
              key={lang}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer focus:ring-2 focus:ring-secondary-500 focus:outline-none ${
                open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              } ${
                currentLanguage === lang
                  ? "bg-secondary-500 text-white"
                  : "border border-primary-300 dark:border-primary-600 text-primary-700 dark:text-primary-300"
              }`}
              style={{ transitionDelay: `${(links.length + ind) * 50}ms` }}
              onClick={() => onLanguageChange(lang)}
              aria-label={lang === "en" ? "Switch to English" : "Mudar para português"}>
              {lang === "en" ? "English" : "Português"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
