import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkillIcon } from "./index";

describe("SkillIcon", () => {
  it("renders an image with the skill_images path and presentational attributes", () => {
    const { container } = render(<SkillIcon imageSrc="react.png" />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "skill_images/react.png");
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveClass("object-contain");
  });

  it("applies sizing class and dimensions when provided", () => {
    const { container } = render(
      <SkillIcon imageSrc="react.png" className="w-14 h-14" width={56} height={56} />,
    );
    const img = container.querySelector("img");
    expect(img).toHaveClass("w-14", "h-14");
    expect(img).toHaveAttribute("width", "56");
    expect(img).toHaveAttribute("height", "56");
  });
});
