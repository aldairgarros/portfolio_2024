import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./index";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>body</Card>);
    expect(screen.getByText("body")).toBeInTheDocument();
  });

  it("renders a soft gray section by default", () => {
    const { container } = render(<Card>content</Card>);
    expect(container.firstChild).toHaveClass("bg-zinc-50");
    expect(container.firstChild).toHaveClass("dark:bg-zinc-950");
  });

  it("renders an almost-white shade when requested", () => {
    const { container } = render(<Card shade="white">content</Card>);
    expect(container.firstChild).toHaveClass("bg-white");
    expect(container.firstChild).toHaveClass("dark:bg-zinc-900");
  });

  it("renders a grayer shade when requested", () => {
    const { container } = render(<Card shade="gray">content</Card>);
    expect(container.firstChild).toHaveClass("bg-zinc-100");
    expect(container.firstChild).toHaveClass("dark:bg-zinc-900");
  });

  it("renders the green shade when requested", () => {
    const { container } = render(<Card shade="green">content</Card>);
    expect(container.firstChild).toHaveClass("bg-emerald-50");
    expect(container.firstChild).toHaveClass("dark:bg-emerald-950");
  });
});
