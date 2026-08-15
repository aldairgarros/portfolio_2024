import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CardLabel } from "./index";

describe("CardLabel", () => {
  it("renders the label text", () => {
    render(<CardLabel>Work</CardLabel>);
    expect(screen.getByText("Work")).toBeInTheDocument();
  });

  it("applies extra classes on top of the base style", () => {
    const { container } = render(<CardLabel className="sm:mb-8">Work</CardLabel>);
    expect(container.firstChild).toHaveClass("font-heading", "uppercase", "sm:mb-8");
  });
});
