import { Mail } from "lucide-react";
import { GlassCard } from "@/components/GlassCard";
import { useTranslation } from "react-i18next";

export function Sticker() {
  const { t } = useTranslation();

  return (
    <div className="fixed hidden lg:block bottom-8 left-8 z-20">
      <GlassCard className="px-4 py-2 text-sm">
        <a
          href={`mailto:${t("contact.list.email.value")}`}
          className="inline-flex items-center gap-2 text-primary-700 dark:text-primary-300 hover:text-secondary-600 dark:hover:text-secondary-400 transition-colors focus:ring-2 focus:ring-secondary-500 focus:outline-none rounded">
          <Mail size={16} />
          {t("contact.list.email.value")}
        </a>
      </GlassCard>
    </div>
  );
}
