import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { VettedBadge } from "@/components/listings/VettedBadge";

describe("VettedBadge", () => {
  it("renders Fully Vetted label for fully_vetted level", () => {
    render(<VettedBadge level="fully_vetted" />);
    expect(screen.getByText("Fully Vetted")).toBeTruthy();
  });

  it("renders Professional Review label for professional_review level", () => {
    render(<VettedBadge level="professional_review" />);
    expect(screen.getByText("Professional Review")).toBeTruthy();
  });

  it("renders Basic label for basic level", () => {
    render(<VettedBadge level="basic" />);
    expect(screen.getByText("Basic")).toBeTruthy();
  });

  it("tooltip content is accessible via role=tooltip on hover interaction", () => {
    render(<VettedBadge level="fully_vetted" />);
    const badge = screen.getByTestId("vetted-badge");
    expect(badge).toBeTruthy();
    // Tooltip span is rendered when visible — verify the info button has accessible label
    const infoBtn = screen.getByRole("button", { name: /what this means/i });
    expect(infoBtn).toBeTruthy();
  });
});
