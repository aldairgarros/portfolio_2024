import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArrowList } from "./index";

describe("ArrowList", () => {
  it("renders every item", () => {
    render(<ArrowList items={["one", "two"]} />);
    expect(screen.getByText("one")).toBeInTheDocument();
    expect(screen.getByText("two")).toBeInTheDocument();
  });

  it("renders an arrow marker for each item", () => {
    const { container } = render(<ArrowList items={["one"]} />);
    expect(container.querySelectorAll("[aria-hidden='true']")).toHaveLength(1);
  });
});
