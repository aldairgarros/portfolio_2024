import translationEN from "@/locales/en.json";
import translationBR from "@/locales/br.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: { translation: translationEN },
  br: { translation: translationBR },
};

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    debug: import.meta.env.DEV,
    lng: "en",
    supportedLngs: ["en", "br"],
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
