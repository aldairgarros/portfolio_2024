import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MenuBar } from "@/modules/MenuBar";
import { BackgroundDecoration } from "@/components/BackgroundDecoration";

const TOP_SECTIONS = ["home", "about", "expertise"] as const;
const PROJECT_SECTIONS = ["atalaiaPro", "penhor", "bolsobom", "musicaShow"] as const;
const BOTTOM_SECTIONS = ["education", "contact"] as const;

export function RootLayout() {
  const { t } = useTranslation("translation");

  const links = [
    ...TOP_SECTIONS.map((id) => ({ label: t(`${id}.title`), hash: id })),
    ...PROJECT_SECTIONS.map((id) => ({ label: t(`projects.list.${id}.name.value`), hash: id })),
    ...BOTTOM_SECTIONS.map((id) => ({ label: t(`${id}.title`), hash: id })),
  ];

  return (
    <div className="flex items-center justify-center">
      <MenuBar links={links} />
      <BackgroundDecoration />
      <Outlet />
    </div>
  );
}
