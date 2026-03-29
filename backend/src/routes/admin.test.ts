import { beforeAll, afterAll, describe, expect, it } from "vitest";
import { prisma } from "../lib/prisma.js";
import { buildServer } from "../server.js";

describe("admin appointment status updates", () => {
  beforeAll(async () => {
    await prisma.doctor.upsert({
      where: { id: "test-doctor-admin-cancel" },
      update: {},
      create: {
        id: "test-doctor-admin-cancel",
        name: "Test Doctor",
        specialty: "General",
        qualifications: "MBBS",
        experience: 5,
        consultationFee: 500,
        rating: 4.5,
        reviewCount: 10,
        availableToday: false,
        photoUrl: "https://example.com/doctor.jpg",
        city: "Delhi",
        isActive: true,
        availability: {
          create: [
            {
              dayOfWeek: 2,
              startTime: "09:00",
              endTime: "10:00",
              slotDuration: 30,
              isActive: true
            }
          ]
        }
      }
    });
  });

  afterAll(async () => {
    await prisma.appointment.deleteMany({
      where: { doctorId: "test-doctor-admin-cancel" }
    });
    await prisma.availability.deleteMany({
      where: { doctorId: "test-doctor-admin-cancel" }
    });
    await prisma.doctor.deleteMany({
      where: { id: "test-doctor-admin-cancel" }
    });
    await prisma.$disconnect();
  });

  it("reopens a cancelled slot and allows rebooking", async () => {
    await prisma.appointment.deleteMany({
      where: { doctorId: "test-doctor-admin-cancel", appointmentDate: "2026-03-31" }
    });

    const created = await prisma.appointment.create({
      data: {
        doctorId: "test-doctor-admin-cancel",
        appointmentDate: "2026-03-31",
        slotTime: "09:00",
        patientName: "Initial Patient",
        patientAge: 30,
        patientGender: "Male",
        patientPhone: "9999999999",
        reason: "",
        forSelf: true,
        paymentMethod: "UPI",
        status: "confirmed"
      }
    });

    const app = await buildServer();

    const cancelResponse = await app.inject({
      method: "PATCH",
      url: `/api/admin/appointments/${created.id}`,
      payload: { status: "Cancelled" }
    });
    expect(cancelResponse.statusCode).toBe(200);

    const slotsResponse = await app.inject({
      method: "GET",
      url: "/api/doctors/test-doctor-admin-cancel/slots?date=2026-03-31"
    });
    expect(slotsResponse.statusCode).toBe(200);
    expect(slotsResponse.json().data.slots).toContain("09:00");

    const rebookResponse = await app.inject({
      method: "POST",
      url: "/api/appointments",
      payload: {
        doctorId: "test-doctor-admin-cancel",
        appointmentDate: "2026-03-31",
        slotTime: "09:00",
        patientName: "Rebooked Patient",
        patientAge: 31,
        patientGender: "Female",
        patientPhone: "8888888888",
        reason: "",
        forSelf: true,
        paymentMethod: "UPI"
      }
    });
    expect(rebookResponse.statusCode).toBe(201);

    const appointment = await prisma.appointment.findUnique({
      where: {
        doctorId_appointmentDate_slotTime: {
          doctorId: "test-doctor-admin-cancel",
          appointmentDate: "2026-03-31",
          slotTime: "09:00"
        }
      }
    });

    expect(appointment?.status).toBe("confirmed");
    expect(appointment?.patientName).toBe("Rebooked Patient");

    await app.close();
  });
});
