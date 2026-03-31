import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { mockGetDoctor } from "@/lib/mock-db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!adminDb) {
    const doctor = mockGetDoctor(id);
    if (!doctor) return NextResponse.json({ message: "Doctor not found." }, { status: 404 });
    return NextResponse.json({ data: doctor });
  }

  const doc = await adminDb.collection("doctors").doc(id).get();
  if (!doc.exists) return NextResponse.json({ message: "Doctor not found." }, { status: 404 });
  return NextResponse.json({ data: { id: doc.id, ...doc.data() } });
}
