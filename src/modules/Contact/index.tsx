import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Globe, GitBranch } from "lucide-react";
import { SectionTitle } from "@/components/SectionTitle";
import { GlassCard } from "@/components/GlassCard";
import { useTranslation } from "react-i18next";

const ICON_MAP: Record<string, typeof Mail> = {
  email: Mail,
  phone: Phone,
  whatsApp: MessageCircle,
  linkedIn: Globe,
  github: GitBranch,
};

const EXTERNAL_KEYS = ["whatsApp", "linkedIn", "github"];

export function Contact() {
  const { t } = useTranslation("translation", { keyPrefix: "contact" });
  const keys = ["email", "phone", "whatsApp", "linkedIn", "github"] as const;

  return (
    <section id="contact" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <GlassCard className="flex items-center">
          <p className="text-primary-700 dark:text-primary-300 leading-relaxed text-lg">
            {t("message")}
          </p>
        </GlassCard>
        <div className="flex flex-col gap-3">
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
                className="inline-flex items-center gap-3 px-4 py-3 rounded-full border border-primary-200 dark:border-primary-700 text-sm text-primary-700 dark:text-primary-300 hover:bg-accent-500 hover:text-white hover:border-accent-500 transition-colors focus:ring-2 focus:ring-accent-500 focus:outline-none"
              >
                <Icon size={18} className="shrink-0" />
                {value}
              </a>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
