/**
 * In-memory store used when Firebase Admin credentials are not configured.
 * Pre-seeded with the same doctors as the Firestore seed script.
 * Data persists for the lifetime of the Next.js server process.
 */

import type { AdminDashboardStats, Appointment, AvailabilityRule, Doctor } from "@/types";

export interface MockDoctor extends Omit<Doctor, "id"> {
  id: string;
  isActive: boolean;
  availability: AvailabilityRule[];
  createdAt: string;
  updatedAt: string;
}

export interface MockAppointment extends Omit<Appointment, "id"> {
  id: string;
  createdAt: string;
  updatedAt: string;
}

function now() {
  return new Date().toISOString();
}

const seed: MockDoctor[] = [
  {
    id: "dr-priya-menon",
    name: "Dr. Priya Menon",
    specialty: "Cardiologist",
    qualifications: "MBBS, MD",
    experience: 12,
    consultationFee: 800,
    rating: 4.8,
    reviewCount: 124,
    availableToday: true,
    photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80",
    city: "Mumbai",
    isActive: true,
    availability: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "12:00", slotDuration: 30, isActive: true },
      { dayOfWeek: 3, startTime: "14:00", endTime: "18:30", slotDuration: 30, isActive: true },
      { dayOfWeek: 5, startTime: "09:00", endTime: "12:00", slotDuration: 30, isActive: true },
    ],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "dr-arjun-sharma",
    name: "Dr. Arjun Sharma",
    specialty: "General",
    qualifications: "MBBS, FCGP",
    experience: 8,
    consultationFee: 400,
    rating: 4.5,
    reviewCount: 98,
    availableToday: true,
    photoUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&q=80",
    city: "Delhi",
    isActive: true,
    availability: [
      { dayOfWeek: 2, startTime: "09:00", endTime: "12:00", slotDuration: 30, isActive: true },
      { dayOfWeek: 4, startTime: "14:00", endTime: "18:00", slotDuration: 30, isActive: true },
      { dayOfWeek: 6, startTime: "09:00", endTime: "11:30", slotDuration: 30, isActive: true },
    ],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "dr-sneha-pillai",
    name: "Dr. Sneha Pillai",
    specialty: "Dermatologist",
    qualifications: "MBBS, DVD",
    experience: 6,
    consultationFee: 600,
    rating: 4.7,
    reviewCount: 110,
    availableToday: true,
    photoUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=400&q=80",
    city: "Bangalore",
    isActive: true,
    availability: [
      { dayOfWeek: 1, startTime: "10:00", endTime: "12:00", slotDuration: 30, isActive: true },
      { dayOfWeek: 2, startTime: "14:00", endTime: "18:30", slotDuration: 30, isActive: true },
      { dayOfWeek: 4, startTime: "10:00", endTime: "12:00", slotDuration: 30, isActive: true },
    ],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "dr-ravi-nair",
    name: "Dr. Ravi Nair",
    specialty: "Ortho",
    qualifications: "MBBS, MS (Ortho)",
    experience: 15,
    consultationFee: 900,
    rating: 4.6,
    reviewCount: 142,
    availableToday: false,
    photoUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80",
    city: "Hyderabad",
    isActive: true,
    availability: [
      { dayOfWeek: 1, startTime: "09:00", endTime: "11:30", slotDuration: 30, isActive: true },
      { dayOfWeek: 3, startTime: "15:00", endTime: "18:00", slotDuration: 30, isActive: true },
      { dayOfWeek: 5, startTime: "09:30", endTime: "11:30", slotDuration: 30, isActive: true },
    ],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "dr-ananya-bose",
    name: "Dr. Ananya Bose",
    specialty: "Gynaecology",
    qualifications: "MBBS, MD (OBG)",
    experience: 10,
    consultationFee: 700,
    rating: 4.9,
    reviewCount: 167,
    availableToday: false,
    photoUrl: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=400&q=80",
    city: "Chennai",
    isActive: true,
    availability: [
      { dayOfWeek: 2, startTime: "09:00", endTime: "11:30", slotDuration: 30, isActive: true },
      { dayOfWeek: 4, startTime: "14:00", endTime: "17:30", slotDuration: 30, isActive: true },
      { dayOfWeek: 6, startTime: "09:00", endTime: "11:00", slotDuration: 30, isActive: true },
    ],
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: "dr-kiran-patel",
    name: "Dr. Kiran Patel",
    specialty: "General",
    qualifications: "MBBS, DNBE",
    experience: 5,
    consultationFee: 350,
    rating: 4.3,
    reviewCount: 76,
    availableToday: false,
    photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
    city: "Thrissur",
    isActive: true,
    availability: [
      { dayOfWeek: 1, startTime: "10:00", endTime: "11:30", slotDuration: 30, isActive: true },
      { dayOfWeek: 3, startTime: "14:00", endTime: "17:00", slotDuration: 30, isActive: true },
      { dayOfWeek: 5, startTime: "10:00", endTime: "12:00", slotDuration: 30, isActive: true },
    ],
    createdAt: now(),
    updatedAt: now(),
  },
];

// Attach stores to globalThis so all route modules share the same instance,
// even when Turbopack evaluates each route in a separate module context.
declare const globalThis: Record<string, unknown>;

if (!globalThis.__mockDoctors) {
  globalThis.__mockDoctors = new Map<string, MockDoctor>(seed.map((d) => [d.id, d]));
}
if (!globalThis.__mockAppointments) {
  globalThis.__mockAppointments = new Map<string, MockAppointment>();
}
if (!globalThis.__mockIdCounter) {
  globalThis.__mockIdCounter = Date.now();
}

const doctors = globalThis.__mockDoctors as Map<string, MockDoctor>;
const appointments = globalThis.__mockAppointments as Map<string, MockAppointment>;

function nextId() {
  (globalThis.__mockIdCounter as number)++;
  return (globalThis.__mockIdCounter as number).toString(36);
}

// ── Doctors ──────────────────────────────────────────────────────────────────

export function mockGetDoctors(opts?: { search?: string; city?: string; specialty?: string }): MockDoctor[] {
  let result = [...doctors.values()].filter((d) => d.isActive);
  const { search, city, specialty } = opts ?? {};

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.qualifications.toLowerCase().includes(q),
    );
  }
  if (city && city !== "All Cities") result = result.filter((d) => d.city === city);
  if (specialty && specialty !== "All") result = result.filter((d) => d.specialty === specialty);
  return result;
}

export function mockGetAllDoctors(): MockDoctor[] {
  return [...doctors.values()];
}

export function mockGetDoctor(id: string): MockDoctor | undefined {
  return doctors.get(id);
}

export function mockCreateDoctor(data: Omit<MockDoctor, "id" | "createdAt" | "updatedAt">): MockDoctor {
  const id = `dr-${nextId()}`;
  const doctor: MockDoctor = { ...data, id, createdAt: now(), updatedAt: now() };
  doctors.set(id, doctor);
  return doctor;
}

export function mockUpdateDoctor(id: string, patch: Partial<MockDoctor>): MockDoctor | null {
  const existing = doctors.get(id);
  if (!existing) return null;
  const updated = { ...existing, ...patch, id, updatedAt: now() };
  doctors.set(id, updated);
  return updated;
}

export function mockDeleteDoctor(id: string): boolean {
  return doctors.delete(id);
}

// ── Appointments ─────────────────────────────────────────────────────────────

export function mockGetAllAppointments(): (Omit<MockAppointment, "doctor"> & { doctor: { id: string; name: string } | null })[] {
  return [...appointments.values()]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((appt) => {
      const doc = doctors.get(appt.doctorId);
      return { ...appt, doctor: doc ? { id: doc.id, name: doc.name } : null };
    });
}

export function mockGetAppointmentsForSlot(doctorId: string, date: string): MockAppointment[] {
  return [...appointments.values()].filter(
    (a) => a.doctorId === doctorId && a.appointmentDate === date,
  );
}

export function mockCreateAppointment(
  data: Omit<MockAppointment, "id" | "status" | "createdAt" | "updatedAt">,
): MockAppointment {
  const id = nextId();
  const appt: MockAppointment = { ...data, id, status: "confirmed", createdAt: now(), updatedAt: now() };
  appointments.set(id, appt);
  return appt;
}

export function mockUpdateAppointmentStatus(id: string, status: string): MockAppointment | null {
  const existing = appointments.get(id);
  if (!existing) return null;
  const updated = { ...existing, status, updatedAt: now() };
  appointments.set(id, updated);
  return updated;
}

// ── Dashboard stats ───────────────────────────────────────────────────────────

export function mockGetStats(): AdminDashboardStats {
  const allDoctors = [...doctors.values()];
  const allAppointments = [...appointments.values()];
  return {
    doctorCount: allDoctors.length,
    activeDoctorCount: allDoctors.filter((d) => d.isActive).length,
    appointmentCount: allAppointments.length,
    upcomingCount: allAppointments.filter((a) => a.status === "confirmed").length,
  };
}
