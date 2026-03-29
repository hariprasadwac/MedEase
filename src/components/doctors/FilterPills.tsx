"use client";

import { specialties } from "@/lib/booking";
import { cn } from "@/lib/utils";

interface FilterPillsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterPills({ activeFilter, onFilterChange }: FilterPillsProps) {
  return (
    <div className="scrollbar-none flex gap-3 overflow-x-auto pb-1">
      {specialties.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onFilterChange(filter)}
          className={cn(
            "min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition",
            activeFilter === filter
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200",
          )}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
