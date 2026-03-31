import type {
  AdminDashboardStats,
  Appointment,
  AvailabilityRule,
  Doctor,
  PatientDetails,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    let message = "Request failed.";
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) {
        message = body.message;
      }
    } catch {}
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = (await response.json()) as { data: T };
  return body.data;
}

export const fetchDoctors = () => apiFetch<Doctor[]>("/doctors");
export const fetchDoctorById = (id: string) => apiFetch<Doctor>(`/doctors/${id}`);
export const fetchDoctorSlots = (id: string, date: string) =>
  apiFetch<{ date: string; slots: string[] }>(`/doctors/${id}/slots?date=${date}`);

export const createAppointment = (input: {
  doctorId: string;
  appointmentDate: string;
  slotTime: string;
  patientDetails: PatientDetails;
  paymentMethod: string;
}) =>
  apiFetch<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify({
      doctorId: input.doctorId,
      appointmentDate: input.appointmentDate,
      slotTime: input.slotTime,
      patientName: input.patientDetails.name,
      patientAge: Number(input.patientDetails.age),
      patientGender: input.patientDetails.gender,
      patientPhone: input.patientDetails.phone,
      reason: input.patientDetails.reason,
      forSelf: input.patientDetails.forSelf,
      paymentMethod: input.paymentMethod,
    }),
  });

export const fetchAdminDashboard = () => apiFetch<AdminDashboardStats>("/admin/dashboard");
export const fetchAdminDoctors = () => apiFetch<Doctor[]>("/admin/doctors");
export const createDoctor = (input: Omit<Doctor, "id">) =>
  apiFetch<Doctor>("/admin/doctors", {
    method: "POST",
    body: JSON.stringify(input),
  });
export const updateDoctor = (id: string, input: Partial<Omit<Doctor, "id">>) =>
  apiFetch<Doctor>(`/admin/doctors/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
export const deleteDoctor = (id: string) =>
  apiFetch<void>(`/admin/doctors/${id}`, { method: "DELETE" });
export const fetchDoctorAvailability = (id: string) =>
  apiFetch<AvailabilityRule[]>(`/admin/doctors/${id}/availability`);
export const updateDoctorAvailability = (id: string, availability: AvailabilityRule[]) =>
  apiFetch<AvailabilityRule[]>(`/admin/doctors/${id}/availability`, {
    method: "PUT",
    body: JSON.stringify(availability),
  });
export const fetchAdminAppointments = () => apiFetch<Appointment[]>("/admin/appointments");
export const updateAppointmentStatus = (id: string, status: string) =>
  apiFetch<Appointment>(`/admin/appointments/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
