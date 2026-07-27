import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Attribute } from "@/components/Attribute";
import { useTranslation } from "react-i18next";

export function Projects() {
  const { t } = useTranslation("translation", { keyPrefix: "projects" });

  const projects = ["penhor", "musicaShow", "bolsobom", "atalaiaPro"];
  const attributes = ["name", "date", "overview"];

  return (
    <div className="w-full" id={t("title")}>
      <Section
        title={t("title")}
        closing="squareBrace"
        className="flex flex-col sm:gap-20 md:pl-20 md:pr-10 py-10 sm:py-20 w-full">
        {projects.map((project) => (
          <div
            key={project}
            className="sm:flex sm:shadow-2xl items-center bg-primary-50 dark:bg-primary-800">
            <div className="flex justify-center p-4 md:p-8 w-full h-full md:h-[500px] md:min-w-[500px] bg-primary-500 dark:bg-primary-400 aspect-square">
              <img
                src={t(`list.${project}.image.src`)}
                alt={t(`list.${project}.image.alt`)}
                width={600}
                height={400}
                className="max-h-full w-auto max-w-full drop-shadow-lg object-contain"
              />
            </div>
            <Container closing="curlyBrace" shadow={false} background={false}>
              <div className="flex flex-col">
                {attributes.map((attribute) => (
                  <Attribute
                    key={attribute}
                    label={t(`list.${project}.${attribute}.label`)}
                    value={t(`list.${project}.${attribute}.value`)}
                  />
                ))}
                <Attribute label="action" value={t("open")} href={`/projects/${project}`} />
              </div>
            </Container>
          </div>
        ))}
      </Section>
    </div>
  );
}
