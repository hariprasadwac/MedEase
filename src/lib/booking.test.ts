import { describe, expect, it } from "vitest";
import { doctorsSeed } from "@/data/doctors-seed";
import {
  createEmptyPatientDetails,
  formatSlotLabel,
  getDoctorSearchScore,
  matchesDoctorFilters,
  validatePatientDetails,
} from "@/lib/booking";

describe("booking helpers", () => {
  it("matches doctor filters across query, city, and specialty", () => {
    expect(matchesDoctorFilters(doctorsSeed[0], "priya", "Mumbai", "Cardiologist")).toBe(true);
    expect(matchesDoctorFilters(doctorsSeed[0], "derma", "Mumbai", "Cardiologist")).toBe(false);
    expect(matchesDoctorFilters(doctorsSeed[0], "", "Delhi", "Cardiologist")).toBe(false);
    expect(matchesDoctorFilters(doctorsSeed[0], "", "Mumbai", "General")).toBe(false);
  });

  it("maps symptoms to the relevant specialty", () => {
    expect(matchesDoctorFilters(doctorsSeed[0], "chest pain", "Mumbai", "All")).toBe(true);
    expect(matchesDoctorFilters(doctorsSeed[0], "chest pa", "Mumbai", "All")).toBe(true);
    expect(matchesDoctorFilters(doctorsSeed[0], "che", "Mumbai", "All")).toBe(true);
    expect(matchesDoctorFilters(doctorsSeed[2], "skin rash", "Bangalore", "All")).toBe(true);
    expect(matchesDoctorFilters(doctorsSeed[4], "irregular periods", "Chennai", "All")).toBe(true);
    expect(matchesDoctorFilters(doctorsSeed[3], "knee pain", "Hyderabad", "All")).toBe(true);
  });

  it("ranks the symptom-matched specialist above unrelated doctors", () => {
    const cardioScore = getDoctorSearchScore(doctorsSeed[0], "chest pain");
    const dermaScore = getDoctorSearchScore(doctorsSeed[2], "chest pain");

    expect(cardioScore).toBeGreaterThan(dermaScore);
  });

  it("validates patient details and reports all required errors", () => {
    const errors = validatePatientDetails(createEmptyPatientDetails());
    expect(errors.name).toBe("Patient name is required.");
    expect(errors.age).toBe("Please enter a valid age (1-120).");
    expect(errors.gender).toBe("Please select a gender.");
    expect(errors.phone).toBe("Please enter a valid 10-digit phone number.");
  });

  it("formats a slot label in 12-hour time", () => {
    expect(formatSlotLabel("17:30")).toBe("05:30 PM");
  });
});
