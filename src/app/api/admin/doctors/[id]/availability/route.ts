import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { mockGetDoctor, mockUpdateDoctor } from "@/lib/mock-db";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!adminDb) {
    const doctor = mockGetDoctor(id);
    if (!doctor) return NextResponse.json({ message: "Doctor not found." }, { status: 404 });
    return NextResponse.json({ data: doctor.availability ?? [] });
  }

  const doc = await adminDb.collection("doctors").doc(id).get();
  if (!doc.exists) return NextResponse.json({ message: "Doctor not found." }, { status: 404 });
  return NextResponse.json({ data: (doc.data() as any).availability ?? [] });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const availability = await request.json();

  if (!adminDb) {
    const updated = mockUpdateDoctor(id, { availability });
    if (!updated) return NextResponse.json({ message: "Doctor not found." }, { status: 404 });
    return NextResponse.json({ data: availability });
  }

  const ref = adminDb.collection("doctors").doc(id);
  const doc = await ref.get();
  if (!doc.exists) return NextResponse.json({ message: "Doctor not found." }, { status: 404 });

  await ref.update({ availability, updatedAt: FieldValue.serverTimestamp() });
  return NextResponse.json({ data: availability });
}
