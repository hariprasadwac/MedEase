import type { Metadata } from "next";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard - MedEase",
  description: "Manage doctors, schedules, and bookings for MedEase.",
};

export default function AdminPage() {
  return <AdminDashboardClient />;
}
