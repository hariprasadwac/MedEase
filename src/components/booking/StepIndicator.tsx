"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const labels = [
  { short: "Schedule", full: "Select Slot" },
  { short: "Details", full: "Patient Details" },
  { short: "Confirm", full: "Confirm & Pay" },
];

export function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="relative z-20 w-full">
      <div className="sr-only">
        {labels.map((label, index) => (
          <span key={label.full}>{`${index + 1} ${label.full}`}</span>
        ))}
      </div>

      <div className="hidden items-center justify-center gap-4 lg:flex">
        {labels.map((label, index) => {
          const step = (index + 1) as 1 | 2 | 3;
          const completed = step < currentStep;
          const active = step === currentStep;

          return (
            <div key={label.full} className="flex items-center gap-4">
              <div className={cn("flex items-center gap-3", !active && !completed && "opacity-40")}>
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                    active && "bg-[#0059bb] text-white",
                    completed && "bg-[#0059bb] text-white",
                    !active && !completed && "bg-[#e0e3e5] text-[#191c1e]",
                  )}
                >
                  {completed ? <Check className="h-4 w-4" /> : step}
                </span>
                <span className="font-[family-name:var(--font-jakarta)] text-[16px] font-bold text-[#191c1e]">
                  {label.short}
                </span>
              </div>
              {index < labels.length - 1 ? (
                <span
                  aria-hidden
                  className={cn(
                    "h-px w-16 rounded-full",
                    completed ? "bg-[#c1c6d7]" : "bg-[rgba(193,198,215,0.3)]",
                  )}
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="relative flex items-center justify-between lg:hidden">
        <span aria-hidden className="absolute left-0 right-0 top-5 h-[2px] bg-[#eceef0]" />
        {labels.map((label, index) => {
          const step = (index + 1) as 1 | 2 | 3;
          const completed = step < currentStep;
          const active = step === currentStep;

          return (
            <div key={label.full} className="relative flex flex-col items-center gap-2">
              <span
                className={cn(
                  "relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-[16px] font-bold",
                  active && "bg-[#0059bb] text-white",
                  completed && "bg-[#0059bb] text-white",
                  !active && !completed && "bg-[#eceef0] text-[#414754]",
                )}
              >
                {completed ? <Check className="h-4 w-4" /> : step}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[1px]",
                  active ? "text-[#0059bb]" : "text-[#414754]",
                )}
              >
                {label.short}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
