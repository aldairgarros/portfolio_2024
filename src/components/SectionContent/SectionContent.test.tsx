import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionContent } from "./index";

describe("SectionContent", () => {
  it("renders children with the stack layout by default", () => {
    const { container } = render(
      <SectionContent>
        <p>content</p>
      </SectionContent>,
    );
    expect(screen.getByText("content")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("flex", "flex-col", "gap-16", "max-w-7xl");
  });

  it("uses the grid layout when requested", () => {
    const { container } = render(<SectionContent variant="grid">content</SectionContent>);
    expect(container.firstChild).toHaveClass("grid", "grid-cols-1", "max-w-7xl");
  });
});
