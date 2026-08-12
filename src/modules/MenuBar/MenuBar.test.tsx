import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { describe, expect, it } from "vitest";
import i18n from "@/i18n";
import { ActiveSectionProvider } from "@/context/ActiveSectionContext";
import { MenuBar, type NavItem } from "./index";

const links: NavItem[] = [
  { label: "about", hash: "about" },
  { label: "projects", hash: "projects", children: [{ label: "Penhor", hash: "penhor" }] },
];

function renderMenuBar() {
  const router = createMemoryRouter([
    {
      path: "/",
      element: (
        <ActiveSectionProvider>
          <MenuBar links={links} />
        </ActiveSectionProvider>
      ),
    },
  ]);
  return render(
    <I18nextProvider i18n={i18n}>
      <RouterProvider router={router} />
    </I18nextProvider>,
  );
}

describe("MenuBar", () => {
  it("opens the menu and shows nav items", async () => {
    const user = userEvent.setup();
    renderMenuBar();
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(screen.getByRole("menuitem", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /penhor/i })).toBeInTheDocument();
  });

  it("switches language", async () => {
    const user = userEvent.setup();
    renderMenuBar();
    await user.click(screen.getByRole("button", { name: /mudar para português/i }));
    expect(document.documentElement.lang).toBe("br");
  });
});
