"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Clock3,
  CreditCard,
  IndianRupee,
  MapPin,
  Smartphone,
} from "lucide-react";
import {
  formatBookingDate,
  formatSlotLabel,
  paymentMethods,
} from "@/lib/booking";
import { cn } from "@/lib/utils";
import type { Doctor, PatientDetails } from "@/types";

const paymentIcons = {
  UPI: Smartphone,
  "Credit / Debit Card": CreditCard,
  "Net Banking": Building2,
  "Pay at Clinic": IndianRupee,
} as const;

interface Step3ConfirmProps {
  doctor: Doctor;
  selectedDay: Date;
  selectedSlot: string;
  patientDetails: PatientDetails;
  paymentMethod: string;
  onPaymentChange: (method: string) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export function Step3Confirm({
  doctor,
  selectedDay,
  selectedSlot,
  patientDetails,
  paymentMethod,
  onPaymentChange,
  onBack,
  onConfirm,
}: Step3ConfirmProps) {
  const totalAmount = doctor.consultationFee;

  return (
    <section className="w-full space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-jakarta)] text-[30px] font-extrabold tracking-[-0.75px] text-[#191c1e] lg:text-[36px] lg:tracking-[-0.9px]">
          Confirm and pay
        </h2>
        <p className="mt-2 max-w-[512px] text-[16px] leading-[26px] text-[#414754]">
          Review the booking summary and choose how the patient will pay.
        </p>
      </div>

      <div className="rounded-[28px] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="flex items-start gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full ring-4 ring-[#f2f4f6]">
            <Image src={doctor.photoUrl || "/doctor-placeholder.svg"} alt={doctor.name} fill sizes="64px" className="object-cover" />
          </div>
          <div className="space-y-1">
            <h3 className="font-[family-name:var(--font-jakarta)] text-[20px] font-bold text-[#191c1e]">
              {doctor.name}
            </h3>
            <p className="font-semibold text-[#0059bb]">{doctor.specialty}</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 text-sm text-[#414754] md:grid-cols-2">
          <div className="rounded-[16px] bg-[#f7f9fb] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.6px] text-[#414754]">
              <CalendarDays className="h-4 w-4 text-[#0059bb]" />
              Date
            </div>
            <p className="font-bold text-[#191c1e]">{formatBookingDate(selectedDay)}</p>
          </div>
          <div className="rounded-[16px] bg-[#f7f9fb] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.6px] text-[#414754]">
              <Clock3 className="h-4 w-4 text-[#0059bb]" />
              Time
            </div>
            <p className="font-bold text-[#191c1e]">{formatSlotLabel(selectedSlot)}</p>
          </div>
          <div className="rounded-[16px] bg-[#f7f9fb] p-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.6px] text-[#414754]">
              Patient
            </div>
            <p className="font-bold text-[#191c1e]">
              {patientDetails.name}, {patientDetails.age}, {patientDetails.gender}
            </p>
          </div>
          <div className="rounded-[16px] bg-[#f7f9fb] p-4">
            <div className="mb-2 text-xs font-bold uppercase tracking-[0.6px] text-[#414754]">
              Phone
            </div>
            <p className="font-bold text-[#191c1e]">{patientDetails.phone}</p>
          </div>
          <div className="rounded-[16px] bg-[#f7f9fb] p-4 md:col-span-2">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.6px] text-[#414754]">
              <MapPin className="h-4 w-4 text-[#0059bb]" />
              Location
            </div>
            <p className="font-bold text-[#191c1e]">{doctor.city}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#191c1e]">Select Payment Method</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {paymentMethods.map((method) => {
            const Icon = paymentIcons[method];
            const active = paymentMethod === method;

            return (
              <button
                key={method}
                type="button"
                onClick={() => onPaymentChange(method)}
                className={cn(
                  "flex min-h-24 items-center gap-3 rounded-[20px] border p-4 text-left transition",
                  active
                    ? "border-[#0059bb] bg-[#eff6ff]"
                    : "border-[rgba(193,198,215,0.45)] bg-white hover:border-[#0059bb]/35",
                )}
              >
                <span className="rounded-2xl bg-white p-3 shadow-sm">
                  <Icon className="h-5 w-5 text-[#0059bb]" />
                </span>
                <span className="font-semibold text-[#191c1e]">{method}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-[24px] bg-[rgba(0,89,187,0.05)] p-5">
        <div className="flex items-center justify-between text-[16px]">
          <span className="text-[#414754]">Consultation Fee</span>
          <span className="font-bold text-[#191c1e]">INR {doctor.consultationFee}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-[16px]">
          <span className="text-[#414754]">Booking Fee</span>
          <span className="font-bold text-[#191c1e]">INR 0</span>
        </div>
        <div className="mt-4 flex items-center justify-between rounded-[16px] bg-white px-4 py-4">
          <span className="font-[family-name:var(--font-jakarta)] text-[16px] font-bold text-[#0059bb]">
            Total Amount
          </span>
          <span className="font-[family-name:var(--font-jakarta)] text-[20px] font-extrabold text-[#0059bb]">
            INR {totalAmount}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-[rgba(193,198,215,0.45)] bg-white px-8 py-4 text-[16px] font-bold text-[#414754]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="button"
          className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#0059bb] px-8 py-4 text-[16px] font-bold text-white shadow-[0_20px_25px_-5px_rgba(0,89,187,0.25),0_8px_10px_-6px_rgba(0,89,187,0.25)]"
          onClick={onConfirm}
        >
          Confirm Appointment
        </button>
      </div>
    </section>
  );
}
