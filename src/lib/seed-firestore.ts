/**
 * One-time seed script to populate Firestore with initial doctor data.
 *
 * Usage (run once locally before deploying):
 *   npx tsx src/lib/seed-firestore.ts
 *
 * Requires FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL,
 * and FIREBASE_ADMIN_PRIVATE_KEY to be set in your environment (or .env.local).
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = getFirestore();

const doctors = [
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
  },
];

async function seed() {
  console.log("Seeding Firestore doctors collection...");
  const batch = db.batch();

  for (const doctor of doctors) {
    const { id, ...data } = doctor;
    const ref = db.collection("doctors").doc(id);
    batch.set(ref, { ...data, createdAt: new Date(), updatedAt: new Date() });
  }

  await batch.commit();
  console.log(`Seeded ${doctors.length} doctors successfully.`);
}

seed().catch(console.error);
