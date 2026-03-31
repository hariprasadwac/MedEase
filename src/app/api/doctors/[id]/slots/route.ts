import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { mockGetDoctor, mockGetAppointmentsForSlot } from "@/lib/mock-db";
import { generateSlots } from "@/lib/slots";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const date = request.nextUrl.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ message: "date query param required." }, { status: 400 });
  }

  const dayOfWeek = new Date(date).getDay();

  if (!adminDb) {
    const doctor = mockGetDoctor(id);
    if (!doctor) return NextResponse.json({ message: "Doctor not found." }, { status: 404 });
    const appointments = mockGetAppointmentsForSlot(id, date);
    const slots = generateSlots(doctor.availability, appointments, dayOfWeek);
    return NextResponse.json({ data: { date, slots } });
  }

  const [doctorDoc, appointmentsSnapshot] = await Promise.all([
    adminDb.collection("doctors").doc(id).get(),
    adminDb.collection("appointments").where("doctorId", "==", id).where("appointmentDate", "==", date).get(),
  ]);

  if (!doctorDoc.exists) return NextResponse.json({ message: "Doctor not found." }, { status: 404 });

  const doctor = doctorDoc.data() as any;
  const appointments = appointmentsSnapshot.docs.map((doc) => doc.data() as any);
  const slots = generateSlots(doctor.availability ?? [], appointments, dayOfWeek);

  return NextResponse.json({ data: { date, slots } });
}
