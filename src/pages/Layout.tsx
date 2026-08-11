import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MenuBar } from "@/modules/MenuBar";
import { BackgroundDecoration } from "@/components/BackgroundDecoration";

interface NavItem {
  label: string;
  hash: string;
  children?: NavItem[];
}

export function RootLayout() {
  const { t } = useTranslation("translation");

  const links: NavItem[] = [
    { label: t("about.title"), hash: "about" },
    { label: t("expertise.title"), hash: "expertise" },
    {
      label: t("projects.title"),
      hash: "projects",
      children: (["atalaiaPro", "penhor", "bolsobom", "musicaShow"] as const).map((id) => ({
        label: t(`projects.list.${id}.name.value`),
        hash: id,
      })),
    },
    { label: t("education.title"), hash: "education" },
    { label: t("contact.title"), hash: "contact" },
  ];

  return (
    <div className="flex items-center justify-center">
      <MenuBar links={links} />
      <BackgroundDecoration />
      <Outlet />
    </div>
  );
}
