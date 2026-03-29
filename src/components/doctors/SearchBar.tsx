"use client";

import { Search } from "lucide-react";
import { cities } from "@/lib/booking";
import { Button } from "@/components/ui/Button";

interface SearchBarProps {
  query: string;
  city: string;
  onSearch: (query: string, city: string) => void;
}

export function SearchBar({ query, city, onSearch }: SearchBarProps) {
  return (
    <div className="grid gap-3 rounded-[28px] border border-white/70 bg-white/90 p-4 shadow-xl shadow-blue-950/5 md:grid-cols-[1fr_180px_auto]">
      <label className="relative block">
        <span className="sr-only">Search by symptom or doctor name</span>
        <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          id="doctor-search"
          value={query}
          onChange={(event) => onSearch(event.target.value, city)}
          placeholder="Search by symptom or doctor name..."
          className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-12 py-3 text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />
      </label>
      <label className="block">
        <span className="sr-only">City</span>
        <select
          aria-label="City"
          value={city}
          onChange={(event) => onSearch(query, event.target.value)}
          className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-transparent focus:ring-2 focus:ring-blue-500"
        >
          {cities.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <Button className="min-h-12" onClick={() => onSearch(query, city)}>
        Search
      </Button>
    </div>
  );
}
