import type { Appointment, Availability, Doctor } from "@prisma/client";

export function serializeDoctor(doctor: Doctor & { availability?: Availability[] }) {
  return {
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
    isActive: doctor.isActive,
    availability:
      doctor.availability?.map((item) => ({
        id: item.id,
        dayOfWeek: item.dayOfWeek,
        startTime: item.startTime,
        endTime: item.endTime,
        slotDuration: item.slotDuration,
        isActive: item.isActive
      })) ?? []
  };
}

export function serializeAppointment(appointment: Appointment & { doctor?: Doctor | null }) {
  return {
    id: appointment.id,
    doctorId: appointment.doctorId,
    appointmentDate: appointment.appointmentDate,
    slotTime: appointment.slotTime,
    patientName: appointment.patientName,
    patientAge: appointment.patientAge,
    patientGender: appointment.patientGender,
    patientPhone: appointment.patientPhone,
    reason: appointment.reason ?? "",
    forSelf: appointment.forSelf,
    paymentMethod: appointment.paymentMethod,
    status: appointment.status,
    createdAt: appointment.createdAt.toISOString(),
    doctor: appointment.doctor
      ? {
          id: appointment.doctor.id,
          name: appointment.doctor.name,
          specialty: appointment.doctor.specialty,
          city: appointment.doctor.city
        }
      : null
  };
}
