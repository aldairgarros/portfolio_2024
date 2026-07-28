import { motion } from "framer-motion";
import { SectionTitle } from "@/components/SectionTitle";
import { ProjectCard } from "./ProjectCard";
import { useTranslation } from "react-i18next";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

interface Props {
  list: string[];
}

export function ProjectList({ list }: Props) {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });

  if (list.length === 0) return null;

  return (
    <section className="py-24 px-4 sm:px-8 max-w-6xl mx-auto">
      <SectionTitle title={t("title")} />
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {list.map((project) => (
          <motion.div key={project} variants={itemVariants}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
