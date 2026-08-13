import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MenuBar, type NavItem } from "@/modules/MenuBar";
import { BackgroundDecoration } from "@/components/BackgroundDecoration";
import { ContactFooter } from "@/modules/Contact";
import { ActiveSectionProvider } from "@/context/ActiveSectionContext";

export function RootLayout() {
  const { t } = useTranslation("translation");

  const links: NavItem[] = [
    {
      label: t("about.title"),
      hash: "about",
      children: (["experience-ui-ux", "experience-full-stack"] as const).map((id) => ({
        label: t(`about.list.${id}.title.value`),
        hash: id,
      })),
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
      label: t("projects.title"),
      hash: "projects",
      children: (["atalaiaPro", "penhor", "bolsobom", "musicaShow"] as const).map((id) => ({
        label: t(`projects.list.${id}.name.value`),
        hash: id,
      })),
    },
    {
      label: t("education.title"),
      hash: "education",
      children: [{ label: t("education.course.title"), hash: "course" }],
    },
  ];

  return (
    <ActiveSectionProvider>
      <div className="flex items-center justify-center">
        <MenuBar links={links} />
        <BackgroundDecoration />
        <Outlet />
        <ContactFooter />
      </div>
    </ActiveSectionProvider>
  );
}
