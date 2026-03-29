"use client";

import { format } from "date-fns";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, Sun, Sunrise, Sunset } from "lucide-react";
import { formatSlotLabel, getNextSevenDays, slotGroups } from "@/lib/booking";
import { cn } from "@/lib/utils";

interface Step1SlotPickerProps {
  selectedDay: Date | null;
  selectedSlot: string | null;
  availableSlots: string[];
  loadingSlots: boolean;
  onDaySelect: (day: Date) => void;
  onSlotSelect: (slot: string) => void;
  onContinue: () => void;
  error: string;
}

export function Step1SlotPicker({
  selectedDay,
  selectedSlot,
  availableSlots,
  loadingSlots,
  onDaySelect,
  onSlotSelect,
  onContinue,
  error,
}: Step1SlotPickerProps) {
  const days = getNextSevenDays();
  const slotIcons = {
    Morning: Sunrise,
    Afternoon: Sun,
    Evening: Sunset,
  };

  return (
    <section className="w-full space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-jakarta)] text-[30px] font-extrabold tracking-[-0.75px] text-[#191c1e] lg:text-[36px] lg:tracking-[-0.9px]">
          <span className="lg:hidden">Pick a time</span>
          <span className="hidden lg:inline">Schedule your visit</span>
        </h2>
        <p className="mt-2 max-w-[512px] text-[16px] leading-[26px] text-[#414754]">
          <span className="lg:hidden">Select your preferred consultation date and available time slot.</span>
          <span className="hidden lg:inline">Select a convenient date and time for your consultation.</span>
        </p>
      </div>

      <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2 lg:rounded-[16px] lg:bg-[#f2f4f6] lg:p-2">
        {days.map((day) => {
          const isSelected =
            selectedDay !== null &&
            selectedDay.toDateString() === day.toDateString();
          const isToday = new Date().toDateString() === day.toDateString();

          return (
            <button
              key={day.toISOString()}
              type="button"
              data-testid="day-card"
              aria-label={`Select ${format(day, "EEEE, d MMMM")}`}
              onClick={() => onDaySelect(day)}
              className={cn(
                "min-h-24 min-w-16 shrink-0 rounded-[16px] border p-4 text-center transition lg:min-h-[96px] lg:min-w-[70px] lg:rounded-[12px]",
                isSelected
                  ? "border-[#0059bb] bg-[#0059bb] text-white shadow-[0_10px_15px_-3px_rgba(0,89,187,0.2),0_4px_6px_-4px_rgba(0,89,187,0.2)] lg:bg-white lg:text-[#191c1e]"
                  : "border-transparent bg-white text-[#414754] hover:border-[#0059bb]/20",
              )}
            >
              <p
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-[-0.5px] lg:tracking-[1.2px]",
                  isSelected ? "text-white/80 lg:text-[#0059bb]" : "text-[#414754]",
                )}
              >
                {format(day, "EEE")}
              </p>
              <p className="mt-2 text-[20px] font-bold leading-7 lg:mt-1 lg:text-[24px] lg:leading-8">
                {format(day, "d")}
              </p>
              {isToday ? (
                <p
                  className={cn(
                    "mt-1 text-[10px] font-bold",
                    isSelected ? "text-white lg:text-[#0059bb]" : "text-[#0059bb]",
                  )}
                >
                  Today
                </p>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="space-y-8">
        {Object.entries(slotGroups).map(([label, slots]) => (
          <div key={label} className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              {(() => {
                const Icon = slotIcons[label as keyof typeof slotIcons] ?? Clock3;
                return <Icon className="h-4 w-4 text-[#414754]" />;
              })()}
              <h3 className="text-[14px] font-bold uppercase tracking-[0.35px] text-[#414754] lg:tracking-normal">
                {label} {label === "Morning" ? "" : "Slots"}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-4">
              {slots.map((slot) => {
                const isBooked = !availableSlots.includes(slot);
                const isSelected = selectedSlot === slot;

                return (
                  <button
                    key={slot}
                    type="button"
                    data-testid="slot-button"
                    aria-label={formatSlotLabel(slot)}
                    disabled={isBooked}
                    onClick={() => onSlotSelect(slot)}
                    className={cn(
                      "min-h-[46px] rounded-[12px] border px-3 py-3 text-[14px] font-semibold transition lg:min-h-[50px] lg:text-[16px] lg:font-bold",
                      isBooked &&
                        "cursor-not-allowed border-transparent bg-[#eceef0] text-[rgba(65,71,84,0.5)] line-through",
                      !isBooked &&
                        !isSelected &&
                        "border-[rgba(193,198,215,0.3)] bg-white text-[#191c1e] hover:border-[#0059bb]/30",
                      isSelected &&
                        "border-[#0059bb] bg-[#0059bb] text-white shadow-[0_10px_15px_-3px_rgba(0,89,187,0.2),0_4px_6px_-4px_rgba(0,89,187,0.2)]",
                    )}
                  >
                    {formatSlotLabel(slot)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {loadingSlots ? <p className="text-sm text-slate-500">Loading available slots...</p> : null}
      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      <div className="hidden items-center justify-between pt-4 lg:flex">
        <Link
          href="/doctors"
          className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-[rgba(193,198,215,0.45)] bg-white px-8 py-4 text-[16px] font-bold text-[#414754]"
        >
          <ArrowLeft className="h-4 w-4" />
          Cancel
        </Link>
        <button
          type="button"
          onClick={onContinue}
          className="ml-auto inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#0059bb] px-8 py-4 text-[16px] font-bold text-white shadow-[0_20px_25px_-5px_rgba(0,89,187,0.25),0_8px_10px_-6px_rgba(0,89,187,0.25)]"
        >
          Continue
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
