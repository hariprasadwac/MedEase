import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingPageClient } from "@/components/booking/BookingPageClient";
import { BookingPageSkeleton } from "@/components/skeletons/BookingPageSkeleton";

export const metadata: Metadata = {
  title: "Book Appointment - MedEase",
  description: "Complete your MedEase booking in three guided steps.",
};

export default function BookingPage() {
  return (
    <Suspense fallback={<BookingPageSkeleton />}>
      <BookingPageClient />
    </Suspense>
  );
}
