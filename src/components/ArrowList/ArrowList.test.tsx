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

  it("renders a grid layout when columns is enabled", () => {
    const { container } = render(<ArrowList items={["one", "two"]} columns />);
    expect(container.querySelector("ul")).toHaveClass("grid");
  });

  it("renders a watermark arrow in each column", () => {
    const { container } = render(<ArrowList items={["one", "two"]} columns />);
    expect(container.querySelectorAll("li [aria-hidden='true']")).toHaveLength(2);
  });

  it("renders a stacked layout by default", () => {
    const { container } = render(<ArrowList items={["one"]} />);
    expect(container.querySelector("ul")).not.toHaveClass("grid");
  });
});
