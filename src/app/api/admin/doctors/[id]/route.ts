import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { mockUpdateDoctor, mockDeleteDoctor } from "@/lib/mock-db";
import { FieldValue } from "firebase-admin/firestore";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  if (!adminDb) {
    const updated = mockUpdateDoctor(id, body);
    if (!updated) return NextResponse.json({ message: "Doctor not found." }, { status: 404 });
    return NextResponse.json({ data: updated });
  }

  const ref = adminDb.collection("doctors").doc(id);
  const doc = await ref.get();
  if (!doc.exists) return NextResponse.json({ message: "Doctor not found." }, { status: 404 });

  const allowed = ["name","specialty","qualifications","experience","consultationFee","rating","reviewCount","availableToday","photoUrl","city","isActive","availability"];
  const updates: Record<string, unknown> = { updatedAt: FieldValue.serverTimestamp() };
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }

  await ref.update(updates);
  const updated = await ref.get();
  return NextResponse.json({ data: { id: updated.id, ...updated.data() } });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!adminDb) {
    mockDeleteDoctor(id);
    return new NextResponse(null, { status: 204 });
  }

  await adminDb.collection("doctors").doc(id).delete();
  return new NextResponse(null, { status: 204 });
}
