export type Specialty =
  | "General"
  | "Cardiologist"
  | "Dermatologist"
  | "Ortho"
  | "Gynaecology";

export interface AvailabilityRule {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDuration: number;
  isActive?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: Specialty;
  qualifications: string;
  experience: number;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  availableToday: boolean;
  photoUrl: string;
  city: string;
  isActive?: boolean;
  availability?: AvailabilityRule[];
}

export interface PatientDetails {
  name: string;
  age: number | "";
  gender: "Male" | "Female" | "Other" | "";
  phone: string;
  reason: string;
  forSelf: boolean;
}

export interface BookingState {
  doctor: Doctor | null;
  selectedDay: Date | null;
  selectedSlot: string | null;
  patientDetails: PatientDetails;
  paymentMethod: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  appointmentDate: string;
  slotTime: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  patientPhone: string;
  reason: string;
  forSelf: boolean;
  paymentMethod: string;
  status: string;
  createdAt: string;
  doctor?: {
    id: string;
    name: string;
    specialty: string;
    city: string;
  } | null;
}

export interface AdminDashboardStats {
  doctorCount: number;
  activeDoctorCount: number;
  appointmentCount: number;
  upcomingCount: number;
}
