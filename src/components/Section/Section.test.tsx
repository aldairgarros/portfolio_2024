import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Section } from "./index";

describe("Section", () => {
  it("renders a visible heading and children", () => {
    render(
      <Section id="about" title="about">
        <p>content</p>
      </Section>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "about" })).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
