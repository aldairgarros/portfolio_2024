import { useTranslation } from "react-i18next";
import { GlassCard } from "@/components/GlassCard";

export function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="flex flex-col items-center justify-center max-h-[1024px] h-screen px-4 text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary-500/10 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-sm sm:text-base font-medium text-secondary-600 dark:text-secondary-400 mb-4 tracking-widest uppercase">
            {t("hero.title.label")}
          </p>
          <h1 className="text-5xl sm:text-7xl font-bold text-primary-900 dark:text-primary-50 mb-6">
            {t("hero.title.value")}
          </h1>
          <p className="text-lg sm:text-xl text-primary-600 dark:text-primary-400 max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle.value")}
          </p>
          <div className="mt-8 flex justify-center">
            <GlassCard className="inline-flex items-center gap-2 px-5 py-2 border-secondary-500/30">
              <span className="text-secondary-600 dark:text-secondary-400 text-sm font-semibold">
                {t("education.course.institution")}
              </span>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
}
