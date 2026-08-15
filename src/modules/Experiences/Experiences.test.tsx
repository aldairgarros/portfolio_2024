import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { ActiveSectionProvider } from "@/context/ActiveSectionContext";
import { Experiences } from "./index";

function renderExperiences() {
  return render(
    <I18nextProvider i18n={i18n}>
      <ActiveSectionProvider>
        <Experiences />
      </ActiveSectionProvider>
    </I18nextProvider>,
  );
}

describe("Experiences", () => {
  it("renders work, tools and achievements cards for each experience", () => {
    renderExperiences();
    expect(screen.getAllByText("work")).toHaveLength(2);
    expect(screen.getAllByText("tools")).toHaveLength(2);
    expect(screen.getAllByText("achievements")).toHaveLength(2);
  });

  it("renders the experience titles", () => {
    renderExperiences();
    expect(screen.getByText("Experience as UI/UX Designer (Freelance)")).toBeInTheDocument();
    expect(screen.getByText("Experience as Full Stack Developer (Freelance)")).toBeInTheDocument();
  });
});
