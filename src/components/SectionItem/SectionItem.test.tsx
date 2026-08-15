import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ActiveSectionProvider } from "@/context/ActiveSectionContext";
import { SectionItem } from "./index";

function renderItem(props: { trigger?: "scroll" | "inherit" }) {
  return render(
    <ActiveSectionProvider>
      <SectionItem id="item" path="~/section/item" {...props}>
        content
      </SectionItem>
    </ActiveSectionProvider>,
  );
}

describe("SectionItem", () => {
  it("renders children inside a div with the item id and scroll offset", () => {
    const { container } = renderItem({});
    expect(screen.getByText("content")).toBeInTheDocument();
    expect(container.querySelector("#item")).toHaveClass("scroll-mt-16");
  });

  it("registers the section path", () => {
    const { container } = renderItem({});
    const el = container.querySelector("#item");
    expect(el).not.toBeNull();
  });

  it("does not self-animate when trigger is inherit", () => {
    const { container } = renderItem({ trigger: "inherit" });
    const el = container.querySelector("#item");
    expect(el).not.toHaveAttribute("initial");
    expect(el).not.toHaveAttribute("whileInView");
  });
});
