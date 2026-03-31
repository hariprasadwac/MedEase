import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { mockCreateAppointment, mockGetAppointmentsForSlot } from "@/lib/mock-db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    doctorId, appointmentDate, slotTime, patientName, patientAge,
    patientGender, patientPhone, reason, forSelf, paymentMethod,
  } = body;

  if (!doctorId || !appointmentDate || !slotTime || !patientName || !patientAge || !patientGender || !patientPhone || !paymentMethod) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
  }
  if (!/^\d{10}$/.test(patientPhone)) {
    return NextResponse.json({ message: "Phone must be 10 digits." }, { status: 400 });
  }
  const age = Number(patientAge);
  if (age < 1 || age > 120) {
    return NextResponse.json({ message: "Age must be between 1 and 120." }, { status: 400 });
  }

  if (!adminDb) {
    const existing = mockGetAppointmentsForSlot(doctorId, appointmentDate).filter(
      (a) => a.slotTime === slotTime && a.status !== "cancelled",
    );
    if (existing.length > 0) return NextResponse.json({ message: "This slot is already booked." }, { status: 409 });

    const appt = mockCreateAppointment({
      doctorId, appointmentDate, slotTime, patientName,
      patientAge: age, patientGender, patientPhone,
      reason: reason ?? null, forSelf: forSelf ?? true, paymentMethod,
    });
    return NextResponse.json({ data: appt }, { status: 201 });
  }

  const existing = await adminDb.collection("appointments")
    .where("doctorId", "==", doctorId)
    .where("appointmentDate", "==", appointmentDate)
    .where("slotTime", "==", slotTime)
    .get();

  const active = existing.docs.filter((d) => d.data().status !== "cancelled");
  if (active.length > 0) return NextResponse.json({ message: "This slot is already booked." }, { status: 409 });

  const n = new Date().toISOString();
  const ref = adminDb.collection("appointments").doc();
  const appt = {
    doctorId, appointmentDate, slotTime, patientName, patientAge: age,
    patientGender, patientPhone, reason: reason ?? null,
    forSelf: forSelf ?? true, paymentMethod, status: "confirmed",
    createdAt: n, updatedAt: n,
  };
  await ref.set(appt);
  return NextResponse.json({ data: { id: ref.id, ...appt } }, { status: 201 });
}
