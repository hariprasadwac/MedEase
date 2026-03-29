import type { Metadata } from "next";
import { DoctorsPageClient } from "@/components/doctors/DoctorsPageClient";

export const metadata: Metadata = {
  title: "MedEase - Find and Book Doctors Near You",
  description: "Search, filter, and book doctors near you with MedEase.",
};

export default function DoctorsPage() {
  return <DoctorsPageClient />;
}
