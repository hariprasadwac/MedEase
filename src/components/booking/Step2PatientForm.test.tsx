import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Step2PatientForm } from "@/components/booking/Step2PatientForm";
import { createEmptyPatientDetails } from "@/lib/booking";

describe("Step2PatientForm", () => {
  it("shows validation errors when required fields are missing", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();

    render(
      <Step2PatientForm
        patientDetails={createEmptyPatientDetails()}
        onChange={vi.fn()}
        onContinue={onContinue}
        onBack={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Patient name is required.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid age (1-120).")).toBeInTheDocument();
    expect(screen.getByText("Please select a gender.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid 10-digit phone number.")).toBeInTheDocument();
    expect(onContinue).not.toHaveBeenCalled();
  });
});
