import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";
import { ContactFooter } from "./index";

describe("ContactFooter", () => {
  it("renders email, phone, and social links", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ContactFooter />
      </I18nextProvider>,
    );
    expect(screen.getByRole("link", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /phone/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
  });

  it("opens external links in a new tab", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ContactFooter />
      </I18nextProvider>,
    );
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "target",
      "_blank",
    );
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
  });
});
