import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { mockGetStats } from "@/lib/mock-db";

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ data: mockGetStats() });
  }

  const [doctorsSnapshot, appointmentsSnapshot] = await Promise.all([
    adminDb.collection("doctors").get(),
    adminDb.collection("appointments").get(),
  ]);

  return NextResponse.json({
    data: {
      doctorCount: doctorsSnapshot.size,
      activeDoctorCount: doctorsSnapshot.docs.filter((d) => d.data().isActive).length,
      appointmentCount: appointmentsSnapshot.size,
      upcomingCount: appointmentsSnapshot.docs.filter((d) => d.data().status === "confirmed").length,
    },
  });
}
