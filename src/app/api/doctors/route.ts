import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { mockGetDoctors } from "@/lib/mock-db";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const search = searchParams.get("search") ?? "";
  const city = searchParams.get("city") ?? "";
  const specialty = searchParams.get("specialty") ?? "";

  if (!adminDb) {
    return NextResponse.json({ data: mockGetDoctors({ search, city, specialty }) });
  }

  const snapshot = await adminDb.collection("doctors").where("isActive", "==", true).get();
  let doctors = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[];

  if (search) {
    const q = search.toLowerCase();
    doctors = doctors.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.specialty?.toLowerCase().includes(q) ||
        d.qualifications?.toLowerCase().includes(q),
    );
  }
  if (city && city !== "All Cities") doctors = doctors.filter((d) => d.city === city);
  if (specialty && specialty !== "All") doctors = doctors.filter((d) => d.specialty === specialty);

  return NextResponse.json({ data: doctors });
}
