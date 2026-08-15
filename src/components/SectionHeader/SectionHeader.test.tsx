import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionHeader } from "./index";

describe("SectionHeader", () => {
  it("renders the title", () => {
    render(<SectionHeader title="My Title" />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("My Title");
  });

  it("renders subtitle and description when provided", () => {
    render(<SectionHeader title="My Title" subtitle="2020 — 2024" description="A description" />);
    expect(screen.getByText("2020 — 2024")).toBeInTheDocument();
    expect(screen.getByText("A description")).toBeInTheDocument();
  });

  it("omits subtitle and description when not provided", () => {
    const { container } = render(<SectionHeader title="My Title" />);
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });

  it("applies the responsive classes passed inline", () => {
    const { container } = render(
      <SectionHeader
        title="Title"
        className="flex flex-col gap-2 sm:gap-4 p-3 sm:p-6 text-center"
        titleClassName="text-2xl sm:text-4xl"
        subtitleClassName="text-base sm:text-xl text-zinc-700 dark:text-zinc-300"
        subtitle="Subtitle"
      />,
    );
    expect(container.firstChild).toHaveClass("gap-2", "sm:gap-4", "p-3", "sm:p-6");
    expect(container.querySelector("h3")).toHaveClass("text-2xl", "sm:text-4xl");
    expect(container.querySelector("p")).toHaveClass("text-base", "sm:text-xl");
  });
});
