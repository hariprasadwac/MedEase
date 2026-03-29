"use client";

import { useEffect, useState } from "react";
import { Building2, CalendarClock, Stethoscope, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  createDoctor,
  deleteDoctor,
  fetchAdminAppointments,
  fetchAdminDashboard,
  fetchAdminDoctors,
  updateAppointmentStatus,
  updateDoctor,
  updateDoctorAvailability,
} from "@/lib/doctors";
import { specialties, weekdays } from "@/lib/booking";
import type {
  AdminDashboardStats,
  Appointment,
  AvailabilityRule,
  Doctor,
  Specialty,
} from "@/types";

const emptyDoctorForm: Omit<Doctor, "id"> = {
  name: "",
  specialty: "General",
  qualifications: "",
  experience: 0,
  consultationFee: 0,
  rating: 4.5,
  reviewCount: 0,
  availableToday: false,
  photoUrl: "",
  city: "",
  isActive: true,
  availability: [],
};

const emptyAvailability: AvailabilityRule = {
  dayOfWeek: 1,
  startTime: "09:00",
  endTime: "12:00",
  slotDuration: 30,
  isActive: true,
};

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Stethoscope;
}) {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-xl shadow-blue-950/5">
      <Icon className="h-5 w-5 text-blue-600" />
      <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

export function AdminDashboardClient() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctorForm, setDoctorForm] = useState<Omit<Doctor, "id">>(emptyDoctorForm);
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [availabilityDrafts, setAvailabilityDrafts] = useState<Record<string, AvailabilityRule[]>>(
    {},
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadDashboard() {
    setLoading(true);
    try {
      const [nextStats, nextDoctors, nextAppointments] = await Promise.all([
        fetchAdminDashboard(),
        fetchAdminDoctors(),
        fetchAdminAppointments(),
      ]);
      setStats(nextStats);
      setDoctors(nextDoctors);
      setAppointments(nextAppointments);
      setAvailabilityDrafts(
        Object.fromEntries(
          nextDoctors.map((doctor) => [doctor.id, doctor.availability ?? []]),
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const submitDoctor = async () => {
    if (editingDoctorId) {
      await updateDoctor(editingDoctorId, doctorForm);
      setMessage("Doctor updated.");
    } else {
      await createDoctor(doctorForm);
      setMessage("Doctor created.");
    }
    setDoctorForm(emptyDoctorForm);
    setEditingDoctorId(null);
    await loadDashboard();
  };

  if (loading && !stats) {
    return <div className="px-4 py-10 text-slate-500">Loading admin dashboard...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
      <section className="rounded-[32px] bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-blue-950/15">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
          Admin Dashboard
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-jakarta)] text-4xl font-bold">
          Manage doctors, timings, and live bookings.
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          This admin area runs inside the main app and controls the Node backend data directly.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Doctors" value={stats?.doctorCount ?? 0} icon={Stethoscope} />
        <StatCard label="Active Doctors" value={stats?.activeDoctorCount ?? 0} icon={Building2} />
        <StatCard label="Appointments" value={stats?.appointmentCount ?? 0} icon={CalendarClock} />
        <StatCard label="Confirmed" value={stats?.upcomingCount ?? 0} icon={CalendarClock} />
      </section>

      {message ? (
        <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      ) : null}

      <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[32px] bg-white p-6 shadow-xl shadow-blue-950/5">
          <div className="flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold text-slate-900">
              {editingDoctorId ? "Edit Doctor" : "Add Doctor"}
            </h2>
            {editingDoctorId ? (
              <button
                type="button"
                className="text-sm font-semibold text-slate-500"
                onClick={() => {
                  setEditingDoctorId(null);
                  setDoctorForm(emptyDoctorForm);
                }}
              >
                Reset
              </button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-4">
            <input
              placeholder="Doctor name"
              value={doctorForm.name}
              onChange={(event) => setDoctorForm({ ...doctorForm, name: event.target.value })}
              className="min-h-12 rounded-xl border border-slate-300 px-4 py-3"
            />
            <select
              value={doctorForm.specialty}
              onChange={(event) =>
                setDoctorForm({
                  ...doctorForm,
                  specialty: event.target.value as Specialty,
                })
              }
              className="min-h-12 rounded-xl border border-slate-300 px-4 py-3"
            >
              {specialties.filter((item) => item !== "All").map((specialty) => (
                <option key={specialty} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
            <input
              placeholder="Qualifications"
              value={doctorForm.qualifications}
              onChange={(event) =>
                setDoctorForm({ ...doctorForm, qualifications: event.target.value })
              }
              className="min-h-12 rounded-xl border border-slate-300 px-4 py-3"
            />
            <div className="grid gap-4 md:grid-cols-2">
              <input
                placeholder="Experience"
                type="number"
                value={doctorForm.experience}
                onChange={(event) =>
                  setDoctorForm({ ...doctorForm, experience: Number(event.target.value) })
                }
                className="min-h-12 rounded-xl border border-slate-300 px-4 py-3"
              />
              <input
                placeholder="Consultation fee"
                type="number"
                value={doctorForm.consultationFee}
                onChange={(event) =>
                  setDoctorForm({ ...doctorForm, consultationFee: Number(event.target.value) })
                }
                className="min-h-12 rounded-xl border border-slate-300 px-4 py-3"
              />
              <input
                placeholder="Rating"
                type="number"
                step="0.1"
                value={doctorForm.rating}
                onChange={(event) =>
                  setDoctorForm({ ...doctorForm, rating: Number(event.target.value) })
                }
                className="min-h-12 rounded-xl border border-slate-300 px-4 py-3"
              />
              <input
                placeholder="Review count"
                type="number"
                value={doctorForm.reviewCount}
                onChange={(event) =>
                  setDoctorForm({ ...doctorForm, reviewCount: Number(event.target.value) })
                }
                className="min-h-12 rounded-xl border border-slate-300 px-4 py-3"
              />
            </div>
            <input
              placeholder="City"
              value={doctorForm.city}
              onChange={(event) => setDoctorForm({ ...doctorForm, city: event.target.value })}
              className="min-h-12 rounded-xl border border-slate-300 px-4 py-3"
            />
            <input
              placeholder="Photo URL"
              value={doctorForm.photoUrl}
              onChange={(event) => setDoctorForm({ ...doctorForm, photoUrl: event.target.value })}
              className="min-h-12 rounded-xl border border-slate-300 px-4 py-3"
            />
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={doctorForm.availableToday}
                onChange={(event) =>
                  setDoctorForm({ ...doctorForm, availableToday: event.target.checked })
                }
              />
              Available today
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={doctorForm.isActive ?? true}
                onChange={(event) =>
                  setDoctorForm({ ...doctorForm, isActive: event.target.checked })
                }
              />
              Doctor active
            </label>
            <Button onClick={submitDoctor}>
              {editingDoctorId ? "Update Doctor" : "Create Doctor"}
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {doctors.map((doctor) => (
            <article
              key={doctor.id}
              className="rounded-[32px] bg-white p-6 shadow-xl shadow-blue-950/5"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h3 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold text-slate-900">
                    {doctor.name}
                  </h3>
                  <p className="font-semibold text-blue-600">{doctor.specialty}</p>
                  <p className="text-sm text-slate-500">
                    {doctor.city} • INR {doctor.consultationFee} • {doctor.experience} years
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingDoctorId(doctor.id);
                      setDoctorForm({
                        name: doctor.name,
                        specialty: doctor.specialty,
                        qualifications: doctor.qualifications,
                        experience: doctor.experience,
                        consultationFee: doctor.consultationFee,
                        rating: doctor.rating,
                        reviewCount: doctor.reviewCount,
                        availableToday: doctor.availableToday,
                        photoUrl: doctor.photoUrl,
                        city: doctor.city,
                        isActive: doctor.isActive ?? true,
                        availability: doctor.availability ?? [],
                      });
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-600"
                    onClick={async () => {
                      await deleteDoctor(doctor.id);
                      setMessage("Doctor deleted.");
                      await loadDashboard();
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-6 space-y-4 rounded-[28px] bg-slate-50 p-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-slate-900">Weekly timings</h4>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setAvailabilityDrafts((current) => ({
                        ...current,
                        [doctor.id]: [...(current[doctor.id] ?? []), { ...emptyAvailability }],
                      }))
                    }
                  >
                    Add timing
                  </Button>
                </div>

                {(availabilityDrafts[doctor.id] ?? []).map((rule, index) => (
                  <div key={`${doctor.id}-${index}`} className="grid gap-3 md:grid-cols-5">
                    <select
                      value={rule.dayOfWeek}
                      onChange={(event) =>
                        setAvailabilityDrafts((current) => ({
                          ...current,
                          [doctor.id]: (current[doctor.id] ?? []).map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, dayOfWeek: Number(event.target.value) }
                              : item,
                          ),
                        }))
                      }
                      className="min-h-11 rounded-xl border border-slate-300 px-3 py-2"
                    >
                      {weekdays.map((day, dayIndex) => (
                        <option key={day} value={dayIndex}>
                          {day}
                        </option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={rule.startTime}
                      onChange={(event) =>
                        setAvailabilityDrafts((current) => ({
                          ...current,
                          [doctor.id]: (current[doctor.id] ?? []).map((item, itemIndex) =>
                            itemIndex === index ? { ...item, startTime: event.target.value } : item,
                          ),
                        }))
                      }
                      className="min-h-11 rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <input
                      type="time"
                      value={rule.endTime}
                      onChange={(event) =>
                        setAvailabilityDrafts((current) => ({
                          ...current,
                          [doctor.id]: (current[doctor.id] ?? []).map((item, itemIndex) =>
                            itemIndex === index ? { ...item, endTime: event.target.value } : item,
                          ),
                        }))
                      }
                      className="min-h-11 rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <input
                      type="number"
                      value={rule.slotDuration}
                      onChange={(event) =>
                        setAvailabilityDrafts((current) => ({
                          ...current,
                          [doctor.id]: (current[doctor.id] ?? []).map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, slotDuration: Number(event.target.value) }
                              : item,
                          ),
                        }))
                      }
                      className="min-h-11 rounded-xl border border-slate-300 px-3 py-2"
                    />
                    <Button
                      variant="ghost"
                      className="justify-center text-red-600"
                      onClick={() =>
                        setAvailabilityDrafts((current) => ({
                          ...current,
                          [doctor.id]: (current[doctor.id] ?? []).filter(
                            (_item, itemIndex) => itemIndex !== index,
                          ),
                        }))
                      }
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Button
                  onClick={async () => {
                    await updateDoctorAvailability(doctor.id, availabilityDrafts[doctor.id] ?? []);
                    setMessage(`Saved timings for ${doctor.name}.`);
                    await loadDashboard();
                  }}
                >
                  Save Timings
                </Button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[32px] bg-white p-6 shadow-xl shadow-blue-950/5">
        <h2 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold text-slate-900">
          Appointment Management
        </h2>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="pb-3">Doctor</th>
                <th className="pb-3">Patient</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Slot</th>
                <th className="pb-3">Payment</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-t border-slate-100">
                  <td className="py-3 pr-4">
                    {appointment.doctor?.name ?? appointment.doctorId}
                  </td>
                  <td className="py-3 pr-4">
                    {appointment.patientName}
                    <div className="text-xs text-slate-500">{appointment.patientPhone}</div>
                  </td>
                  <td className="py-3 pr-4">{appointment.appointmentDate}</td>
                  <td className="py-3 pr-4">{appointment.slotTime}</td>
                  <td className="py-3 pr-4">{appointment.paymentMethod}</td>
                  <td className="py-3 pr-4">
                    <select
                      value={appointment.status}
                      onChange={async (event) => {
                        await updateAppointmentStatus(appointment.id, event.target.value);
                        setMessage(`Updated appointment for ${appointment.patientName}.`);
                        await loadDashboard();
                      }}
                      className="min-h-10 rounded-xl border border-slate-300 px-3 py-2"
                    >
                      <option value="confirmed">confirmed</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
