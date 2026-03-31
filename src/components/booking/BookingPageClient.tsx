"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Step1SlotPicker } from "@/components/booking/Step1SlotPicker";
import { Step2PatientForm } from "@/components/booking/Step2PatientForm";
import { Step3Confirm } from "@/components/booking/Step3Confirm";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { SuccessCheckmark } from "@/components/booking/SuccessCheckmark";
import { BookingPageSkeleton } from "@/components/skeletons/BookingPageSkeleton";
import {
  createEmptyPatientDetails,
  formatBookingDate,
  formatSlotLabel,
  getNextSevenDays,
} from "@/lib/booking";
import { createAppointment, getDoctorById, getDoctorSlots } from "@/lib/doctors";
import { cn } from "@/lib/utils";
import type { Doctor, PatientDetails } from "@/types";

const LAST_DOCTOR_ID_KEY = "medease-last-doctor-id";
const patientDetailsKey = (id: string) => `medease-patient-${id}`;

export function BookingPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const doctorId = searchParams.get("doctorId");
  const [resolvedDoctorId, setResolvedDoctorId] = useState<string | null>(doctorId);

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [patientDetails, setPatientDetails] = useState<PatientDetails>(
    createEmptyPatientDetails(),
  );
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotCache, setSlotCache] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const patientDetailsLoadedRef = useRef(false);

  useEffect(() => {
    if (doctorId) {
      setResolvedDoctorId(doctorId);
      window.localStorage.setItem(LAST_DOCTOR_ID_KEY, doctorId);
      return;
    }

    const savedDoctorId = window.localStorage.getItem(LAST_DOCTOR_ID_KEY);
    setResolvedDoctorId(savedDoctorId);
  }, [doctorId]);

  useEffect(() => {
    let active = true;

    if (!resolvedDoctorId) {
      setDoctor(null);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);

    getDoctorById(resolvedDoctorId)
      .then((result) => {
        if (active) {
          setDoctor(result);
          window.localStorage.setItem(LAST_DOCTOR_ID_KEY, result.id);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [resolvedDoctorId]);

  useEffect(() => {
    let active = true;

    if (!doctor) {
      setSlotCache({});
      setAvailableSlots([]);
      return () => {
        active = false;
      };
    }

    setLoadingSlots(true);

    const upcomingDays = getNextSevenDays();

    Promise.all(
      upcomingDays.map(async (day) => {
        const dateKey = format(day, "yyyy-MM-dd");
        const result = await getDoctorSlots(doctor.id, dateKey);
        return [dateKey, result.slots] as const;
      }),
    )
      .then((results) => {
        if (active) {
          const nextCache = Object.fromEntries(results);
          setSlotCache(nextCache);

          const selectedDateKey = selectedDay ? format(selectedDay, "yyyy-MM-dd") : null;
          const nextSlots = selectedDateKey ? nextCache[selectedDateKey] ?? [] : [];
          setAvailableSlots(nextSlots);

          if (selectedSlot && !nextSlots.includes(selectedSlot)) {
            setSelectedSlot(null);
          }
        }
      })
      .catch(() => {
        if (active) {
          setSlotCache({});
          setAvailableSlots([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoadingSlots(false);
        }
      });

    return () => {
      active = false;
    };
  }, [doctor]);

  useEffect(() => {
    let active = true;

    if (!doctor || !selectedDay) {
      setAvailableSlots([]);
      return () => {
        active = false;
      };
    }

    const dateKey = format(selectedDay, "yyyy-MM-dd");
    const cachedSlots = slotCache[dateKey];

    if (cachedSlots) {
      setAvailableSlots(cachedSlots);
      if (selectedSlot && !cachedSlots.includes(selectedSlot)) {
        setSelectedSlot(null);
      }

      return () => {
        active = false;
      };
    }

    setLoadingSlots(true);

    getDoctorSlots(doctor.id, dateKey)
      .then((result) => {
        if (active) {
          setSlotCache((current) => ({ ...current, [dateKey]: result.slots }));
          setAvailableSlots(result.slots);
          if (selectedSlot && !result.slots.includes(selectedSlot)) {
            setSelectedSlot(null);
          }
        }
      })
      .catch(() => {
        if (active) {
          setAvailableSlots([]);
        }
      })
      .finally(() => {
        if (active) {
          setLoadingSlots(false);
        }
      });

    return () => {
      active = false;
    };
  }, [doctor, selectedDay, selectedSlot, slotCache]);

  // Load saved patient details when doctor changes
  useEffect(() => {
    patientDetailsLoadedRef.current = false;
    if (!resolvedDoctorId) {
      setPatientDetails(createEmptyPatientDetails());
      return;
    }
    try {
      const saved = window.localStorage.getItem(patientDetailsKey(resolvedDoctorId));
      setPatientDetails(saved ? (JSON.parse(saved) as PatientDetails) : createEmptyPatientDetails());
    } catch {
      setPatientDetails(createEmptyPatientDetails());
    }
    patientDetailsLoadedRef.current = true;
  }, [resolvedDoctorId]);

  // Persist patient details whenever they change
  useEffect(() => {
    if (!resolvedDoctorId || !patientDetailsLoadedRef.current) return;
    window.localStorage.setItem(patientDetailsKey(resolvedDoctorId), JSON.stringify(patientDetails));
  }, [patientDetails, resolvedDoctorId]);

  if (loading || (doctor && selectedDay && loadingSlots && availableSlots.length === 0)) {
    return <BookingPageSkeleton />;
  }

  if (!doctor) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="rounded-[32px] bg-white p-10 text-center shadow-xl shadow-blue-950/5">
          <h1 className="font-[family-name:var(--font-jakarta)] text-3xl font-bold text-slate-900">
            Doctor not found
          </h1>
          <p className="mt-3 text-slate-500">
            Start again from the doctors listing and select a profile to book.
          </p>
          <Link
            href="/doctors"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Back to doctors
          </Link>
        </div>
      </div>
    );
  }

  const bookingFee = 0;
  const totalAmount = doctor.consultationFee + bookingFee;

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#f1f5f9] bg-white/80 backdrop-blur-[12px]">
        {/* Desktop header */}
        <div className="mx-auto hidden h-16 w-full max-w-[1440px] items-center px-8 lg:flex">
          <Link
            href="/doctors"
            className="font-[family-name:var(--font-jakarta)] text-[24px] font-bold tracking-[-1.2px] text-[#1d4ed8]"
          >
            MedEase
          </Link>
        </div>
        {/* Mobile header */}
        <div className="flex items-center gap-3 px-6 py-4 lg:hidden">
          <button
            type="button"
            aria-label="Go back"
            onClick={() => {
              if (currentStep > 1) setCurrentStep((currentStep - 1) as 1 | 2 | 3);
              else router.push("/doctors");
            }}
          >
            <ArrowLeft className="h-4 w-4 text-[#475569]" />
          </button>
          <p className="text-[18px] font-bold tracking-[-0.45px] text-[#1d4ed8]">MedEase</p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1440px] px-6 pb-12 pt-24 lg:px-8 lg:pb-16 lg:pt-28">
        <div className="space-y-10">
          <StepIndicator currentStep={currentStep} />

          {currentStep === 1 ? (
            <button
              type="button"
              onClick={() => {
                if (!selectedDay || !selectedSlot || !availableSlots.includes(selectedSlot)) {
                  setSlotError("Please select a date and time slot to continue.");
                  return;
                }

                setCurrentStep(2);
              }}
              className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0059bb] px-8 py-4 text-[16px] font-bold text-white shadow-[0_20px_25px_-5px_rgba(0,89,187,0.25),0_8px_10px_-6px_rgba(0,89,187,0.25)] lg:hidden"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : null}

          <div className={cn("grid gap-8", currentStep === 1 && "lg:grid-cols-[minmax(0,1fr)_320px]")}>
            <motion.div
              key={currentStep}
              className="min-w-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
            >
              {currentStep === 1 ? (
                <Step1SlotPicker
                  selectedDay={selectedDay}
                  selectedSlot={selectedSlot}
                  availableSlots={availableSlots}
                  loadingSlots={loadingSlots}
                  onDaySelect={(day) => {
                    setSelectedDay(day);
                    setSlotError("");
                  }}
                  onSlotSelect={(slot) => {
                    setSelectedSlot(slot);
                    setSlotError("");
                  }}
                  onContinue={() => {
                    if (!selectedDay || !selectedSlot || !availableSlots.includes(selectedSlot)) {
                      setSlotError("Please select a date and time slot to continue.");
                      return;
                    }

                    setCurrentStep(2);
                  }}
                  error={slotError}
                />
              ) : null}

              {currentStep === 2 ? (
                <Step2PatientForm
                  patientDetails={patientDetails}
                  onChange={setPatientDetails}
                  onBack={() => setCurrentStep(1)}
                  onContinue={() => setCurrentStep(3)}
                />
              ) : null}

              {currentStep === 3 && selectedDay && selectedSlot ? (
                <Step3Confirm
                  doctor={doctor}
                  selectedDay={selectedDay}
                  selectedSlot={selectedSlot}
                  patientDetails={patientDetails}
                  paymentMethod={paymentMethod}
                  onPaymentChange={setPaymentMethod}
                  onBack={() => setCurrentStep(2)}
                  onConfirm={async () => {
                    setSubmitting(true);
                    setSubmitError("");
                    try {
                      await createAppointment({
                        doctorId: doctor.id,
                        appointmentDate: format(selectedDay, "yyyy-MM-dd"),
                        slotTime: selectedSlot,
                        patientDetails,
                        paymentMethod,
                      });
                      setBookingConfirmed(true);
                    } catch (error) {
                      setSubmitError(
                        error instanceof Error ? error.message : "Unable to confirm the appointment.",
                      );
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                />
              ) : null}
            </motion.div>

            {currentStep === 1 ? (
              <aside className="hidden rounded-[32px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)] lg:sticky lg:top-28 lg:block">
                <h2 className="font-[family-name:var(--font-jakarta)] text-[20px] font-bold text-[#191c1e]">
                  Booking Summary
                </h2>
                <div className="mt-4 rounded-[20px] bg-[#f2f4f6] p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-[16px]">
                      <Image src={doctor.photoUrl || "/doctor-placeholder.svg"} alt={doctor.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-[family-name:var(--font-jakarta)] text-[18px] font-bold text-[#191c1e]">
                        {doctor.name}
                      </p>
                      <p className="text-[14px] font-medium leading-5 text-[#0059bb]">{doctor.specialty}</p>
                      <p className="mt-1 text-[12px] text-[#414754]">
                        {doctor.rating.toFixed(1)} ({doctor.reviewCount} reviews)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  <SummaryRow
                    icon={<CalendarDays className="h-4 w-4 text-[#0059bb]" />}
                    label="Date"
                    value={selectedDay ? formatBookingDate(selectedDay) : "Select a date"}
                  />
                  <SummaryRow
                    icon={<Clock3 className="h-4 w-4 text-[#0059bb]" />}
                    label="Time"
                    value={selectedSlot ? `${formatSlotLabel(selectedSlot)} (30 min)` : "Select a slot"}
                  />
                  <SummaryRow
                    icon={<MapPin className="h-4 w-4 text-[#0059bb]" />}
                    label="Location"
                    value={doctor.city}
                  />
                </div>

                <div className="mt-6 border-t border-dashed border-[#c1c6d7] pt-5">
                  <div className="flex items-center justify-between text-[16px] text-[#414754]">
                    <span>Consultation Fee</span>
                    <span className="font-bold text-[#191c1e]">INR {doctor.consultationFee}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[16px] text-[#414754]">
                    <span>Booking Fee</span>
                    <span className="font-bold text-[#191c1e]">INR {bookingFee}</span>
                  </div>
                  <div className="mt-4 rounded-[12px] bg-[rgba(0,89,187,0.05)] px-4 py-4">
                    <div className="flex items-center justify-between">
                      <span className="font-[family-name:var(--font-jakarta)] text-[16px] font-bold text-[#0059bb]">
                        Total Amount
                      </span>
                      <span className="font-[family-name:var(--font-jakarta)] text-[20px] font-extrabold text-[#0059bb]">
                        INR {totalAmount}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-[16px] bg-[#e0e3e5] p-4 text-center text-[12px] leading-[19.5px] text-[#414754]">
                  Free cancellation up to 24 hours before your appointment. Secure payment via MedEase.
                </div>
              </aside>
            ) : null}
          </div>
        </div>

        {submitError ? (
          <p className="mt-4 text-center text-sm text-red-600">{submitError}</p>
        ) : null}
        {submitting ? (
          <p className="mt-4 text-center text-sm text-slate-500">Confirming appointment...</p>
        ) : null}
      </div>

      <SuccessCheckmark open={bookingConfirmed} />

    </div>
  );
}

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(0,89,187,0.1)]">
        {icon}
      </div>
      <div>
        <p className="text-[12px] font-bold uppercase tracking-[0.6px] text-[#414754]">{label}</p>
        <p className="text-[16px] font-bold leading-6 text-[#191c1e]">{value}</p>
      </div>
    </div>
  );
}

