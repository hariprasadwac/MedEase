import { z } from "zod";
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { serializeAppointment, serializeDoctor } from "../lib/serializers.js";

const doctorSchema = z.object({
  name: z.string().min(2),
  specialty: z.string().min(2),
  qualifications: z.string().min(2),
  experience: z.number().int().min(0),
  consultationFee: z.number().int().min(0),
  rating: z.number().min(0).max(5),
  reviewCount: z.number().int().min(0),
  availableToday: z.boolean(),
  photoUrl: z.string().url(),
  city: z.string().min(2),
  isActive: z.boolean().default(true)
});

const availabilityItemSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().min(5),
  endTime: z.string().min(5),
  slotDuration: z.number().int().min(15).max(120),
  isActive: z.boolean().default(true)
});

const appointmentStatusSchema = z.enum(["confirmed", "completed", "cancelled"]);

export async function registerAdminRoutes(app: FastifyInstance) {
  app.get("/dashboard", async () => {
    const [doctorCount, activeDoctorCount, appointmentCount, upcomingCount] = await Promise.all([
      prisma.doctor.count(),
      prisma.doctor.count({ where: { isActive: true } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: "confirmed" } })
    ]);

    return {
      data: { doctorCount, activeDoctorCount, appointmentCount, upcomingCount }
    };
  });

  app.get("/doctors", async () => {
    const doctors = await prisma.doctor.findMany({
      include: { availability: true },
      orderBy: { name: "asc" }
    });
    return { data: doctors.map(serializeDoctor) };
  });

  app.post("/doctors", async (request, reply) => {
    const payload = doctorSchema.parse(request.body);
    const doctor = await prisma.doctor.create({
      data: payload,
      include: { availability: true }
    });
    return reply.status(201).send({ data: serializeDoctor(doctor) });
  });

  app.patch("/doctors/:id", async (request, reply) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const payload = doctorSchema.partial().parse(request.body);

    try {
      const doctor = await prisma.doctor.update({
        where: { id },
        data: payload,
        include: { availability: true }
      });
      return { data: serializeDoctor(doctor) };
    } catch {
      return reply.status(404).send({ message: "Doctor not found" });
    }
  });

  app.delete("/doctors/:id", async (request, reply) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    try {
      await prisma.doctor.delete({ where: { id } });
      return reply.status(204).send();
    } catch {
      return reply.status(404).send({ message: "Doctor not found" });
    }
  });

  app.get("/doctors/:id/availability", async (request, reply) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: { availability: true }
    });
    if (!doctor) {
      return reply.status(404).send({ message: "Doctor not found" });
    }
    return { data: serializeDoctor(doctor).availability };
  });

  app.put("/doctors/:id/availability", async (request, reply) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const payload = z.array(availabilityItemSchema).parse(request.body);
    const doctor = await prisma.doctor.findUnique({ where: { id } });

    if (!doctor) {
      return reply.status(404).send({ message: "Doctor not found" });
    }

    await prisma.availability.deleteMany({ where: { doctorId: id } });
    await prisma.doctor.update({
      where: { id },
      data: {
        availability: {
          create: payload
        }
      }
    });

    const updated = await prisma.doctor.findUnique({
      where: { id },
      include: { availability: true }
    });

    return { data: serializeDoctor(updated!).availability };
  });

  app.get("/appointments", async () => {
    const appointments = await prisma.appointment.findMany({
      include: { doctor: true },
      orderBy: [{ appointmentDate: "desc" }, { slotTime: "desc" }]
    });
    return { data: appointments.map(serializeAppointment) };
  });

  app.patch("/appointments/:id", async (request, reply) => {
    const { id } = z.object({ id: z.string() }).parse(request.params);
    const payload = z
      .object({ status: z.string().min(1) })
      .transform(({ status }) => ({
        status: appointmentStatusSchema.parse(status.trim().toLowerCase())
      }))
      .parse(request.body);
    try {
      const appointment = await prisma.appointment.update({
        where: { id },
        data: { status: payload.status },
        include: { doctor: true }
      });
      return { data: serializeAppointment(appointment) };
    } catch {
      return reply.status(404).send({ message: "Appointment not found" });
    }
  });
}
