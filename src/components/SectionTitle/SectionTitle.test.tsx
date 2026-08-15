import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionTitle } from "./index";

describe("SectionTitle", () => {
  it("renders an h2 heading with the given text", () => {
    render(<SectionTitle>Projects</SectionTitle>);
    expect(screen.getByRole("heading", { level: 2, name: "Projects" })).toBeInTheDocument();
  });
});
