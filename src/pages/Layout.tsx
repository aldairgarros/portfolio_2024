import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MenuBar } from "@/modules/MenuBar";
import { BackgroundDecoration } from "@/components/BackgroundDecoration";

const SECTIONS = ["home", "education", "projects", "expertise", "about", "contact"];

export function RootLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center">
      <MenuBar links={SECTIONS.map((id) => ({ label: t(`${id}.title`), hash: id }))} />
      <BackgroundDecoration />
      <Outlet />
    </div>
  );
}
