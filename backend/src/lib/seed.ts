import { prisma } from "./prisma.js";
import { doctorsSeed } from "../seed-data.js";

export async function ensureSeedData() {
  const count = await prisma.doctor.count();
  if (count > 0) {
    return;
  }

  for (const doctor of doctorsSeed) {
    await prisma.doctor.create({
      data: {
        id: doctor.id,
        name: doctor.name,
        specialty: doctor.specialty,
        qualifications: doctor.qualifications,
        experience: doctor.experience,
        consultationFee: doctor.consultationFee,
        rating: doctor.rating,
        reviewCount: doctor.reviewCount,
        availableToday: doctor.availableToday,
        photoUrl: doctor.photoUrl,
        city: doctor.city,
        availability: {
          create: doctor.availability.map((slot) => ({
            dayOfWeek: slot.dayOfWeek,
            startTime: slot.startTime,
            endTime: slot.endTime,
            slotDuration: slot.slotDuration
          }))
        }
      }
    });
  }
}
