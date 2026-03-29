import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Step3Confirm } from "@/components/booking/Step3Confirm";
import { doctorsSeed } from "@/data/doctors-seed";
import { createEmptyPatientDetails } from "@/lib/booking";

describe("Step3Confirm", () => {
  it("renders summary content and allows payment method changes", async () => {
    const user = userEvent.setup();
    const onPaymentChange = vi.fn();

    render(
      <Step3Confirm
        doctor={doctorsSeed[0]}
        selectedDay={new Date("2026-03-31T00:00:00")}
        selectedSlot="10:00"
        patientDetails={{
          ...createEmptyPatientDetails(),
          name: "Asha Rao",
          age: 31,
          gender: "Female",
          phone: "9876543210",
        }}
        paymentMethod="UPI"
        onPaymentChange={onPaymentChange}
        onBack={vi.fn()}
        onConfirm={vi.fn()}
      />,
    );

    expect(screen.getByText("Dr. Priya Menon")).toBeInTheDocument();
    expect(screen.getByText("Asha Rao, 31, Female")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Net Banking/i }));
    expect(onPaymentChange).toHaveBeenCalledWith("Net Banking");
  });
});
