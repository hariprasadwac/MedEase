import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { mockGetAllAppointments } from "@/lib/mock-db";

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ data: mockGetAllAppointments() });
  }

  const [appointmentsSnapshot, doctorsSnapshot] = await Promise.all([
    adminDb.collection("appointments").orderBy("createdAt", "desc").get(),
    adminDb.collection("doctors").get(),
  ]);

  const doctorMap = new Map(
    doctorsSnapshot.docs.map((doc) => [doc.id, { id: doc.id, name: (doc.data() as any).name }]),
  );

  const appointments = appointmentsSnapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return { id: doc.id, ...data, doctor: doctorMap.get(data.doctorId) ?? null };
  });

  return NextResponse.json({ data: appointments });
}
