import { ActiveSectionProvider } from "@/context/ActiveSectionContext";
import { ContactFooter } from "@/modules/Contact";
import { MenuBar, type NavItem } from "@/modules/MenuBar";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

export function RootLayout() {
  const { t } = useTranslation("translation");

  const links: NavItem[] = [
    {
      label: t("credentials.title"),
      hash: "credentials",
      children: [{ label: t("credentials.course.title"), hash: "course" }],
    },
    {
      label: t("expertise.title"),
      hash: "expertise",
      children: (
        ["api-backend", "frontend-engineering", "mobile", "devops", "ux-strategy"] as const
      ).map((id) => ({
        label: t(`expertise.list.${id}.title`),
        hash: id,
      })),
    },
    {
      label: t("experiences.title"),
      hash: "experiences",
      children: (["experience-ui-ux", "experience-full-stack"] as const).map((id) => ({
        label: t(`experiences.list.${id}.title.value`),
        hash: id,
      })),
    },
    {
      label: t("projects.title"),
      hash: "projects",
      children: (["atalaiaPro", "penhor", "bolsobom", "musicaShow"] as const).map((id) => ({
        label: t(`projects.list.${id}.name.value`),
        hash: id,
      })),
    },
  ];

  return (
    <ActiveSectionProvider>
      <div className="flex items-center justify-center">
        <MenuBar links={links} />
        <Outlet />
        <ContactFooter />
      </div>
    </ActiveSectionProvider>
  );
}
