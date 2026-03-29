import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StepIndicator } from "@/components/booking/StepIndicator";

describe("StepIndicator", () => {
  it("shows completed, active, and upcoming labels", () => {
    render(<StepIndicator currentStep={2} />);

    expect(screen.getByText("1 Select Slot")).toBeInTheDocument();
    expect(screen.getByText("2 Patient Details")).toBeInTheDocument();
    expect(screen.getByText("3 Confirm & Pay")).toBeInTheDocument();
  });
});
