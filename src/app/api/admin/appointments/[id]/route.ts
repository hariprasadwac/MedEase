import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { mockUpdateAppointmentStatus } from "@/lib/mock-db";
import { FieldValue } from "firebase-admin/firestore";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { status } = await request.json();

  const allowed = ["confirmed", "completed", "cancelled"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ message: "Invalid status." }, { status: 400 });
  }

  if (!adminDb) {
    const updated = mockUpdateAppointmentStatus(id, status);
    if (!updated) return NextResponse.json({ message: "Appointment not found." }, { status: 404 });
    return NextResponse.json({ data: updated });
  }

  const ref = adminDb.collection("appointments").doc(id);
  const doc = await ref.get();
  if (!doc.exists) return NextResponse.json({ message: "Appointment not found." }, { status: 404 });

  await ref.update({ status, updatedAt: FieldValue.serverTimestamp() });
  const updated = await ref.get();
  return NextResponse.json({ data: { id: updated.id, ...updated.data() } });
}
