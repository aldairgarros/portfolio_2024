import { Outlet } from "react-router-dom";
import { MenuBar } from "@/modules/MenuBar";

export function RootLayout() {
  const LINKS = [
    { label: "Home", hash: "hero" },
    { label: "Education", hash: "education" },
    { label: "Projects", hash: "projects" },
    { label: "Expertise", hash: "expertise" },
    { label: "About", hash: "about" },
    { label: "Contact", hash: "contact" },
  ];

  return (
    <div className="flex items-center justify-center">
      <MenuBar links={LINKS} />
      <Outlet />
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10 transform-gpu overflow-hidden blur-3xl">
        <div
          style={{
            clipPath: "polygon(0% 70%, 20% 20%, 0% 0%, 30% 100%, 100% 10%, 20% 50%, 100% 50%)",
          }}
          className="relative aspect-square h-full left-1/2 -translate-x-1/2 bg-gradient-to-tr from-primary-600 to-primary-100 opacity-20 dark:from-primary-800 dark:to-primary-950"
        />
      </div>
    </div>
  );
}
