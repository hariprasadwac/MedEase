import { describe, expect, it } from "vitest";
import { generateSlots } from "./slots.js";

describe("generateSlots", () => {
  it("creates slots and removes booked times", () => {
    const slots = generateSlots(
      [
        {
          id: "a",
          doctorId: "d",
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "10:30",
          slotDuration: 30,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      [
        {
          id: "x",
          doctorId: "d",
          appointmentDate: "2026-03-30",
          slotTime: "09:30",
          patientName: "A",
          patientAge: 30,
          patientGender: "Male",
          patientPhone: "9999999999",
          reason: "",
          forSelf: true,
          paymentMethod: "UPI",
          status: "confirmed",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      1,
    );

    expect(slots).toEqual(["09:00", "10:00"]);
  });
});
