import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TerminalFrame, TerminalPanel, TerminalSeparator } from "./index";

describe("TerminalFrame", () => {
  it("renders title and children", () => {
    render(<TerminalFrame title="projects">content</TerminalFrame>);
    expect(screen.getByText("projects")).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("renders without a title", () => {
    render(<TerminalFrame>content</TerminalFrame>);
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});

describe("TerminalPanel", () => {
  it("renders title and children", () => {
    render(<TerminalPanel title="panel">body</TerminalPanel>);
    expect(screen.getByText("panel")).toBeInTheDocument();
    expect(screen.getByText("body")).toBeInTheDocument();
  });
});

describe("TerminalSeparator", () => {
  it("renders a decorative divider", () => {
    const { container } = render(<TerminalSeparator />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
