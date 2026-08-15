import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { ActiveSectionProvider } from "@/context/ActiveSectionContext";
import { Expertise } from "./index";

function renderExpertise() {
  return render(
    <I18nextProvider i18n={i18n}>
      <ActiveSectionProvider>
        <Expertise />
      </ActiveSectionProvider>
    </I18nextProvider>,
  );
}

describe("Expertise", () => {
  it("renders context, applicability and impact cards for each capability", () => {
    renderExpertise();
    expect(screen.getAllByText("context")).toHaveLength(5);
    expect(screen.getAllByText("applicability")).toHaveLength(5);
    expect(screen.getAllByText("impact")).toHaveLength(5);
  });
});
