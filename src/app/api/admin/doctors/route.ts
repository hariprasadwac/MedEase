import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { mockGetAllDoctors, mockCreateDoctor } from "@/lib/mock-db";

export async function GET() {
  if (!adminDb) {
    return NextResponse.json({ data: mockGetAllDoctors() });
  }
  const snapshot = await adminDb.collection("doctors").get();
  return NextResponse.json({ data: snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, specialty, qualifications, experience, consultationFee, rating, reviewCount, availableToday, photoUrl, city, isActive, availability } = body;

  if (!name || !specialty || !qualifications || !city) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
  }

  const data = {
    name,
    specialty,
    qualifications,
    experience: Number(experience),
    consultationFee: Number(consultationFee),
    rating: Number(rating),
    reviewCount: Number(reviewCount),
    availableToday: Boolean(availableToday),
    photoUrl: photoUrl ?? "",
    city,
    isActive: isActive !== undefined ? Boolean(isActive) : true,
    availability: availability ?? [],
  };

  if (!adminDb) {
    const doctor = mockCreateDoctor(data);
    return NextResponse.json({ data: doctor }, { status: 201 });
  }

  const n = new Date().toISOString();
  const ref = adminDb.collection("doctors").doc();
  await ref.set({ ...data, createdAt: n, updatedAt: n });
  return NextResponse.json({ data: { id: ref.id, ...data, createdAt: n, updatedAt: n } }, { status: 201 });
}
