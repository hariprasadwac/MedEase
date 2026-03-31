import type { AvailabilityRule } from "@/types";

interface BookedSlot {
  slotTime: string;
  status: string;
}

function toMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function toTime(value: number) {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function generateSlots(
  availability: AvailabilityRule[],
  appointments: BookedSlot[],
  dayOfWeek: number,
): string[] {
  const slots = new Set<string>();
  const booked = new Set(
    appointments.filter((item) => item.status !== "cancelled").map((item) => item.slotTime),
  );

  for (const rule of availability) {
    if (!rule.isActive || rule.dayOfWeek !== dayOfWeek) {
      continue;
    }

    for (
      let current = toMinutes(rule.startTime);
      current + rule.slotDuration <= toMinutes(rule.endTime);
      current += rule.slotDuration
    ) {
      const slot = toTime(current);
      if (!booked.has(slot)) {
        slots.add(slot);
      }
    }
  }

  return [...slots].sort();
}
