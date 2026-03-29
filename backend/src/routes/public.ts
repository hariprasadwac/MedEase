import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { serializeAppointment, serializeDoctor } from "../lib/serializers.js";
import { generateSlots } from "../lib/slots.js";

const appointmentSchema = z.object({
  doctorId: z.string().min(1),
  appointmentDate: z.string().min(1),
  slotTime: z.string().min(1),
  patientName: z.string().min(2),
  patientAge: z.number().int().min(1).max(120),
  patientGender: z.enum(["Male", "Female", "Other"]),
  patientPhone: z.string().regex(/^\d{10}$/),
  reason: z.string().max(500).optional().default(""),
  forSelf: z.boolean().default(true),
  paymentMethod: z.string().min(1)
});

export async function registerPublicRoutes(app: FastifyInstance) {
  app.get("/doctors", async (request) => {
    const query = z
      .object({
        search: z.string().optional(),
        city: z.string().optional(),
        specialty: z.string().optional()
      })
      .parse(request.query);

    const doctors = await prisma.doctor.findMany({
      where: {
        isActive: true,
        ...(query.city && query.city !== "All Cities" ? { city: query.city } : {}),
        ...(query.specialty && query.specialty !== "All" ? { specialty: query.specialty } : {}),
        ...(query.search
          ? {
              OR: [
                { name: { contains: query.search } },
                { specialty: { contains: query.search } }
              ]
            }
          : {})
      },
      include: { availability: true },
      orderBy: [{ rating: "desc" }, { name: "asc" }]
    });

    return { data: doctors.map(serializeDoctor) };
  });

  app.get("/doctors/:id", async (request, reply) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: { availability: true }
    });

    if (!doctor || !doctor.isActive) {
      return reply.status(404).send({ message: "Doctor not found" });
    }

    return { data: serializeDoctor(doctor) };
  });

  app.get("/doctors/:id/slots", async (request, reply) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const { date } = z.object({ date: z.string() }).parse(request.query);
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: { availability: true }
    });

    if (!doctor || !doctor.isActive) {
      return reply.status(404).send({ message: "Doctor not found" });
    }

    const appointmentDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(appointmentDate.getTime())) {
      return reply.status(400).send({ message: "Invalid date" });
    }

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: id, appointmentDate: date }
    });

    return {
      data: {
        date,
        slots: generateSlots(doctor.availability, appointments, appointmentDate.getDay())
      }
    };
  });

  app.post("/appointments", async (request, reply) => {
    const payload = appointmentSchema.parse(request.body);
    const doctor = await prisma.doctor.findUnique({ where: { id: payload.doctorId } });

    if (!doctor || !doctor.isActive) {
      return reply.status(404).send({ message: "Doctor not found" });
    }

    try {
      const existingAppointment = await prisma.appointment.findUnique({
        where: {
          doctorId_appointmentDate_slotTime: {
            doctorId: payload.doctorId,
            appointmentDate: payload.appointmentDate,
            slotTime: payload.slotTime
          }
        },
        include: { doctor: true }
      });

      const appointment =
        existingAppointment?.status === "cancelled"
          ? await prisma.appointment.update({
              where: { id: existingAppointment.id },
              data: { ...payload, status: "confirmed" },
              include: { doctor: true }
            })
          : await prisma.appointment.create({
              data: payload,
              include: { doctor: true }
            });

      return reply.status(201).send({ data: serializeAppointment(appointment) });
    } catch {
      return reply.status(409).send({ message: "Selected slot is no longer available." });
    }
  });
}
