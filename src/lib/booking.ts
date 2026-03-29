import { addDays, format } from "date-fns";
import type { Doctor, PatientDetails, Specialty } from "@/types";

export const specialties: Array<"All" | Specialty> = [
  "All",
  "General",
  "Cardiologist",
  "Dermatologist",
  "Ortho",
  "Gynaecology",
];

export const cities = [
  "All Cities",
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Thrissur",
] as const;

export const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const slotGroups = {
  Morning: ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"],
  Afternoon: ["14:00", "14:30", "15:00", "15:30"],
  Evening: ["17:00", "17:30", "18:00", "18:30"],
} as const;

export const paymentMethods = [
  "UPI",
  "Credit / Debit Card",
  "Net Banking",
  "Pay at Clinic",
] as const;

const specialtySearchAliases: Record<Specialty, string[]> = {
  Cardiologist: [
    "cardio",
    "cardiac",
    "heart",
    "chest pain",
    "chest tightness",
    "palpitation",
    "palpitations",
    "high bp",
    "high blood pressure",
    "hypertension",
    "breathlessness",
    "shortness of breath",
  ],
  Dermatologist: [
    "derma",
    "dermatology",
    "skin",
    "rash",
    "rashes",
    "acne",
    "eczema",
    "itching",
    "itchy skin",
    "psoriasis",
    "pigmentation",
    "hair fall",
    "dandruff",
  ],
  Ortho: [
    "ortho",
    "orthopedic",
    "orthopaedic",
    "bone",
    "bones",
    "joint",
    "joints",
    "knee pain",
    "back pain",
    "neck pain",
    "shoulder pain",
    "fracture",
    "sprain",
    "arthritis",
  ],
  Gynaecology: [
    "gynae",
    "gynae",
    "gynaecology",
    "gynecology",
    "period",
    "period pain",
    "irregular periods",
    "pcos",
    "pcod",
    "pregnancy",
    "pregnant",
    "fertility",
    "women health",
    "pelvic pain",
  ],
  General: [
    "general",
    "fever",
    "cold",
    "cough",
    "headache",
    "body pain",
    "body ache",
    "infection",
    "viral",
    "fatigue",
    "weakness",
    "stomach pain",
    "vomiting",
    "diarrhea",
  ],
};

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function getSearchTerms(value: string) {
  return normalizeSearchText(value)
    .split(" ")
    .map((term) => term.trim())
    .filter(Boolean);
}

function matchesAlias(alias: string, query: string) {
  const normalizedAlias = normalizeSearchText(alias);
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return false;
  }

  if (normalizedAlias.includes(normalizedQuery) || normalizedQuery.includes(normalizedAlias)) {
    return true;
  }

  const aliasTerms = getSearchTerms(normalizedAlias);
  const queryTerms = getSearchTerms(normalizedQuery);

  return queryTerms.every((queryTerm) =>
    aliasTerms.some((aliasTerm) => aliasTerm.startsWith(queryTerm) || queryTerm.startsWith(aliasTerm)),
  );
}

function getQueryMatchedSpecialties(query: string) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return new Set<Specialty>();
  }

  const matches = new Set<Specialty>();

  (Object.entries(specialtySearchAliases) as Array<[Specialty, string[]]>).forEach(
    ([specialty, aliases]) => {
      if (aliases.some((alias) => matchesAlias(alias, normalizedQuery))) {
        matches.add(specialty);
      }
    },
  );

  return matches;
}

export function getDoctorSearchScore(doctor: Doctor, query: string) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return 1;
  }

  let score = 0;
  const normalizedName = doctor.name.toLowerCase();
  const normalizedSpecialty = doctor.specialty.toLowerCase();
  const specialtyMatches = getQueryMatchedSpecialties(normalizedQuery);

  if (normalizedName.includes(normalizedQuery)) {
    score += 120;
  }

  if (getSearchTerms(normalizedQuery).every((term) => normalizedName.includes(term))) {
    score += 45;
  }

  if (normalizedSpecialty.includes(normalizedQuery)) {
    score += 100;
  }

  if (getSearchTerms(normalizedQuery).every((term) => normalizedSpecialty.includes(term))) {
    score += 40;
  }

  if (specialtyMatches.has(doctor.specialty)) {
    score += 90;
  }

  const specialtyAliases = specialtySearchAliases[doctor.specialty];
  if (specialtyAliases.some((alias) => matchesAlias(alias, normalizedQuery))) {
    score += 40;
  }

  return score;
}

export function getNextSevenDays(from = new Date()) {
  return Array.from({ length: 7 }, (_, index) => addDays(from, index));
}

export function formatBookingDate(date: Date) {
  return format(date, "EEEE, d MMMM yyyy");
}

export function toApiDate(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function formatSlotLabel(slot: string) {
  const [hours, minutes] = slot.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return format(date, "hh:mm a");
}

export function matchesDoctorFilters(
  doctor: Doctor,
  query: string,
  city: string,
  specialty: string,
) {
  const matchesQuery = getDoctorSearchScore(doctor, query) > 0;
  const matchesCity = city === "All Cities" || doctor.city === city;
  const matchesSpecialty = specialty === "All" || doctor.specialty === specialty;
  return matchesQuery && matchesCity && matchesSpecialty;
}

export function createEmptyPatientDetails(): PatientDetails {
  return {
    name: "",
    age: "",
    gender: "",
    phone: "",
    reason: "",
    forSelf: true,
  };
}

export function validatePatientDetails(details: PatientDetails) {
  const errors: Partial<Record<keyof PatientDetails, string>> = {};

  if (!details.name.trim() || !/^[A-Za-z ]{2,}$/.test(details.name.trim())) {
    errors.name = "Patient name is required.";
  }

  if (
    details.age === "" ||
    !Number.isInteger(Number(details.age)) ||
    Number(details.age) < 1 ||
    Number(details.age) > 120
  ) {
    errors.age = "Please enter a valid age (1-120).";
  }

  if (!details.gender) {
    errors.gender = "Please select a gender.";
  }

  if (!/^\d{10}$/.test(details.phone)) {
    errors.phone = "Please enter a valid 10-digit phone number.";
  }

  if (details.reason.length > 500) {
    errors.reason = "Reason for visit must be 500 characters or fewer.";
  }

  return errors;
}
