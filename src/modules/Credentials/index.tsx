import { useTranslation } from "react-i18next";
import { LuGraduationCap } from "react-icons/lu";
import { Card } from "@/components/Card";
import { Section } from "@/components/Section";
import { SectionContent } from "@/components/SectionContent";
import { SectionHeader } from "@/components/SectionHeader";
import { SectionItem } from "@/components/SectionItem";
import { useActiveSection } from "@/context/ActiveSectionContext";

export function Credentials() {
  const { t } = useTranslation("translation", { keyPrefix: "credentials" });
  const sectionRef = useActiveSection("~/credentials");

  return (
    <Section
      id="credentials"
      title={t("title")}
      sectionRef={sectionRef}
      className="bg-emerald-50 dark:bg-emerald-950"
    >
      <SectionContent variant="grid">
        <SectionItem id="course" path="~/credentials/course">
          <SectionHeader
            title={t("course.title")}
            subtitle={
              <>
                {t("course.institution")} ({t("course.period")})
              </>
            }
            className="flex flex-col gap-2 sm:gap-4 p-3 sm:p-6 text-center"
            titleClassName="text-2xl sm:text-4xl"
            subtitleClassName="text-base sm:text-xl text-zinc-700 dark:text-zinc-300"
          />
          <Card shade="white" className="sm:p-20">
            <div className="flex flex-col sm:flex-row sm:gap-20 items-center">
              <LuGraduationCap
                className="size-36 -my-4 sm:-my-8 sm:size-72 text-emerald-600 dark:text-emerald-400 shrink-0"
                aria-hidden="true"
                strokeWidth={0.25}
              />
              <div className="flex flex-col gap-4">
                <h4 className="text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl text-center text-lg sm:text-2xl font-bold">
                  {t("course.description")}
                </h4>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed max-w-3xl text-center sm:text-xl">
                  {t("course.details")}
                </p>
              </div>
            </div>
          </Card>
        </SectionItem>
      </SectionContent>
    </Section>
  );
}
