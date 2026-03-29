"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { validatePatientDetails } from "@/lib/booking";
import { cn } from "@/lib/utils";
import type { PatientDetails } from "@/types";

interface Step2PatientFormProps {
  patientDetails: PatientDetails;
  onChange: (details: PatientDetails) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function Step2PatientForm({
  patientDetails,
  onChange,
  onContinue,
  onBack,
}: Step2PatientFormProps) {
  const [errors, setErrors] = useState<Partial<Record<keyof PatientDetails, string>>>({});
  const inputClassName =
    "mt-2 min-h-14 w-full rounded-[16px] border border-[rgba(193,198,215,0.45)] bg-white px-4 py-3 text-[16px] text-[#191c1e] outline-none transition focus:border-[#0059bb] focus:ring-0";

  const handleSubmit = () => {
    const nextErrors = validatePatientDetails(patientDetails);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      onContinue();
    }
  };

  const updateField = <K extends keyof PatientDetails>(field: K, value: PatientDetails[K]) => {
    onChange({ ...patientDetails, [field]: value });
  };

  return (
    <section className="w-full space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-jakarta)] text-[30px] font-extrabold tracking-[-0.75px] text-[#191c1e] lg:text-[36px] lg:tracking-[-0.9px]">
          Tell us about the patient
        </h2>
        <p className="mt-2 max-w-[512px] text-[16px] leading-[26px] text-[#414754]">
          Add the patient details required to complete the appointment request.
        </p>
      </div>

      <div className="grid max-w-sm grid-cols-2 rounded-[16px] bg-[#f2f4f6] p-1">
        {[
          { label: "For Myself", value: true },
          { label: "For Someone Else", value: false },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => updateField("forSelf", option.value)}
            className={cn(
              "min-h-12 rounded-[12px] px-4 py-3 text-[14px] font-semibold transition",
              patientDetails.forSelf === option.value
                ? "bg-[#0059bb] text-white shadow-[0_10px_15px_-3px_rgba(0,89,187,0.2),0_4px_6px_-4px_rgba(0,89,187,0.2)]"
                : "text-[#414754]",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="patient-name" className="text-sm font-semibold text-[#414754]">
            Patient Name
          </label>
          <input
            id="patient-name"
            value={patientDetails.name}
            onChange={(event) => updateField("name", event.target.value)}
            className={inputClassName}
          />
          {errors.name ? <p className="mt-1 text-xs text-red-600">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="patient-age" className="text-sm font-semibold text-[#414754]">
            Age
          </label>
          <input
            id="patient-age"
            type="number"
            min="1"
            max="120"
            value={patientDetails.age}
            onChange={(event) =>
              updateField("age", event.target.value === "" ? "" : Number(event.target.value))
            }
            className={inputClassName}
          />
          {errors.age ? <p className="mt-1 text-xs text-red-600">{errors.age}</p> : null}
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-[#414754]">Gender</legend>
          <div className="mt-2 flex min-h-14 flex-wrap gap-3 rounded-[16px] border border-[rgba(193,198,215,0.45)] bg-white px-4 py-3">
            {(["Male", "Female", "Other"] as const).map((option) => (
              <label key={option} className="inline-flex items-center gap-2 text-sm text-[#414754]">
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={patientDetails.gender === option}
                  onChange={() => updateField("gender", option)}
                />
                {option}
              </label>
            ))}
          </div>
          {errors.gender ? <p className="mt-1 text-xs text-red-600">{errors.gender}</p> : null}
        </fieldset>

        <div className="md:col-span-2">
          <label htmlFor="patient-phone" className="text-sm font-semibold text-[#414754]">
            Phone Number
          </label>
          <input
            id="patient-phone"
            inputMode="numeric"
            value={patientDetails.phone}
            onChange={(event) => updateField("phone", event.target.value.replace(/\D/g, "").slice(0, 10))}
            className={inputClassName}
          />
          {errors.phone ? <p className="mt-1 text-xs text-red-600">{errors.phone}</p> : null}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="patient-reason" className="text-sm font-semibold text-[#414754]">
            Reason for Visit
          </label>
          <textarea
            id="patient-reason"
            rows={5}
            value={patientDetails.reason}
            onChange={(event) => updateField("reason", event.target.value.slice(0, 500))}
            className="mt-2 w-full rounded-[16px] border border-[rgba(193,198,215,0.45)] bg-white px-4 py-3 text-[16px] text-[#191c1e] outline-none transition focus:border-[#0059bb] focus:ring-0"
          />
          <div className="mt-1 flex items-center justify-between">
            {errors.reason ? <p className="text-xs text-red-600">{errors.reason}</p> : <span />}
            <p className="text-xs text-slate-400">{patientDetails.reason.length}/500</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
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
          onClick={handleSubmit}
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#0059bb] px-8 py-4 text-[16px] font-bold text-white shadow-[0_20px_25px_-5px_rgba(0,89,187,0.25),0_8px_10px_-6px_rgba(0,89,187,0.25)]"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
