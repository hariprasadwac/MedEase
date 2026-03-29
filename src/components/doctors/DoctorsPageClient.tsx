"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Clock3,
  Heart,
  LayoutGrid,
  MapPin,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Star,
  Stethoscope,
  UserRound,
  Wallet,
} from "lucide-react";
import { DoctorsPageSkeleton } from "@/components/skeletons/DoctorsPageSkeleton";
import { cities, getDoctorSearchScore, matchesDoctorFilters, specialties } from "@/lib/booking";
import { getDoctors } from "@/lib/doctors";
import type { Doctor, Specialty } from "@/types";

const mobileNavItems = [
  { label: "Home", icon: LayoutGrid },
  { label: "Appointments", icon: CalendarDays },
  { label: "Search", icon: Search, active: true },
  { label: "Profile", icon: UserRound },
];

const specialtyLabels: Record<"All" | Specialty, string> = {
  All: "All",
  General: "General",
  Cardiologist: "Cardiologist",
  Dermatologist: "Dermatologist",
  Ortho: "Orthopaedic Surgeon",
  Gynaecology: "Gynaecologist",
};

const mobileSpecialtyLabels: Record<"All" | Specialty, string> = {
  ...specialtyLabels,
  Ortho: "Ortho",
  Gynaecology: "Gynaecology",
};

function formatFee(amount: number) {
  return `INR ${amount}`;
}

function formatExperience(years: number) {
  return `${years} ${years === 1 ? "Year" : "Years"}`;
}

function DesktopDoctorCard({ doctor }: { doctor: Doctor }) {
  const router = useRouter();

  return (
    <article className="flex min-h-[432px] flex-col rounded-[32px] bg-white p-6 shadow-[0_12px_32px_rgba(25,28,30,0.04)]">
      <div className="mb-6 flex items-start justify-between">
        <div className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-[#f8fafc]">
          <Image
            src={doctor.photoUrl}
            alt={doctor.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        {doctor.availableToday ? (
          <div
            data-testid="available-today-badge"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#006860]/10 px-3 py-1"
          >
            <span className="h-2 w-2 rounded-full bg-[#006860]" />
            <span className="text-[12px] font-bold text-[#006860]">Available Today</span>
          </div>
        ) : null}
      </div>

      <div className="mb-6">
        <h2 className="font-[family-name:var(--font-jakarta)] text-[20px] font-bold leading-7 text-[#191c1e]">
          {doctor.name}
        </h2>
        <p className="text-[14px] font-medium leading-5 text-[#0059bb]">
          {specialtyLabels[doctor.specialty]}
        </p>
      </div>

      <div className="mb-8 space-y-3 text-[14px] leading-5">
        <div className="flex items-center justify-between gap-4 text-[#414754]">
          <span>Qualification</span>
          <span className="text-right font-semibold text-[#191c1e]">{doctor.qualifications}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[#414754]">
          <span>Experience</span>
          <span className="text-right font-semibold text-[#191c1e]">
            {formatExperience(doctor.experience)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[#414754]">
          <span>Consultation Fee</span>
          <span className="text-right font-semibold text-[#191c1e]">{formatFee(doctor.consultationFee)}</span>
        </div>
        <div className="flex items-center justify-between gap-4 text-[#414754]">
          <span>Rating</span>
          <span className="inline-flex items-center gap-1 font-semibold text-[#191c1e]">
            <Star className="h-[13px] w-[13px] fill-[#f6bf24] text-[#f6bf24]" />
            {doctor.rating.toFixed(1)} ({doctor.reviewCount}+)
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push(`/booking?doctorId=${doctor.id}`)}
        className="mt-auto flex h-14 items-center justify-center rounded-2xl bg-[#e6e8ea] text-[16px] font-bold text-[#0059bb]"
      >
        Book Appointment
      </button>
    </article>
  );
}

function MobileDoctorCard({ doctor }: { doctor: Doctor }) {
  const router = useRouter();

  return (
    <article className="relative rounded-[40px] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      {doctor.availableToday ? (
        <div
          data-testid="available-today-badge"
          className="absolute right-6 top-6 inline-flex items-center gap-1.5 rounded-full bg-[#006860]/10 px-3 py-1"
        >
          <span className="h-2 w-2 rounded-full bg-[#006860]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.5px] text-[#006860]">
            Available Today
          </span>
        </div>
      ) : null}

      <div className="mb-6 flex items-start gap-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full ring-4 ring-[#f2f4f6]">
          <Image
            src={doctor.photoUrl}
            alt={doctor.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <div className="mb-2 flex items-center gap-1.5 text-[#191c1e]">
            <Star className="h-[14px] w-[14px] fill-[#f6bf24] text-[#f6bf24]" />
            <span className="text-[16px] font-bold leading-6">{doctor.rating.toFixed(1)}</span>
            <span className="text-[12px] leading-4 text-[#414754]">({doctor.reviewCount} reviews)</span>
          </div>
          <h2 className="truncate font-[family-name:var(--font-jakarta)] text-[20px] font-bold leading-[25px] text-[#191c1e]">
            {doctor.name}
          </h2>
          <p className="text-[14px] font-semibold leading-5 text-[#0059bb]">
            {doctor.specialty === "Cardiologist" ? "Senior Cardiologist" : specialtyLabels[doctor.specialty]}
          </p>
        </div>
      </div>

      <div className="mb-8 space-y-3 text-[14px] leading-5 text-[#414754]">
        <div className="flex items-center gap-3">
          <Stethoscope className="h-4 w-4 text-[#191c1e]" />
          <span>{doctor.qualifications}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock3 className="h-4 w-4 text-[#191c1e]" />
          <span>{formatExperience(doctor.experience)} Experience</span>
        </div>
        <div className="flex items-center gap-3">
          <Wallet className="h-4 w-4 text-[#191c1e]" />
          <span>
            <span className="font-bold text-[#191c1e]">{formatFee(doctor.consultationFee)}</span>{" "}
            <span className="text-[12px]">per consultation</span>
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => router.push(`/booking?doctorId=${doctor.id}`)}
        className="flex h-14 items-center justify-center rounded-2xl bg-[#d8e2ff] text-[16px] font-bold text-[#26467c]"
      >
        Book Appointment
      </button>
    </article>
  );
}

export function DoctorsPageClient() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [cityDraft, setCityDraft] = useState<(typeof cities)[number]>("All Cities");
  const [cityFilter, setCityFilter] = useState<(typeof cities)[number]>("All Cities");
  const [specialtyFilter, setSpecialtyFilter] = useState<"All" | Specialty>("All");

  useEffect(() => {
    let active = true;

    getDoctors()
      .then((items) => {
        if (active) {
          setDoctors(items);
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
  }, []);

  useEffect(() => {
    function syncViewport() {
      setIsDesktop(window.innerWidth >= 1024);
    }

    syncViewport();
    window.addEventListener("resize", syncViewport);

    return () => {
      window.removeEventListener("resize", syncViewport);
    };
  }, []);

  const filteredDoctors = doctors
    .filter((doctor) => matchesDoctorFilters(doctor, searchQuery, cityFilter, specialtyFilter))
    .sort((left, right) => {
      const scoreDifference = getDoctorSearchScore(right, searchQuery) - getDoctorSearchScore(left, searchQuery);

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      if (right.rating !== left.rating) {
        return right.rating - left.rating;
      }

      return right.reviewCount - left.reviewCount;
    });

  function applySearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSearchQuery(searchDraft);
    setCityFilter(cityDraft);
  }

  const featuredDoctor = doctors[0];

  if (loading) {
    return <DoctorsPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      {isDesktop ? (
        <>
          <header className="fixed inset-x-0 top-0 z-40 border-b border-[#f1f5f9] bg-white/80 backdrop-blur-[10px]">
          <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-8">
            <div className="flex items-center">
              <Link
                href="/doctors"
                className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold tracking-[-1.2px] text-[#1d4ed8]"
              >
                MedEase
              </Link>
            </div>
            <div className="flex items-center gap-4" />
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1440px] px-8 py-12 pt-[128px]">
          <div className="mx-auto max-w-[1152px]">
              <section>
                <h1 className="font-[family-name:var(--font-jakarta)] text-[36px] font-extrabold tracking-[-0.9px] text-[#191c1e]">
                  Find Your Specialist
                </h1>
                <p className="mt-4 max-w-[672px] text-[16px] leading-[26px] text-[#414754]">
                  Book in-person or virtual appointments with the highest-rated medical
                  professionals in your area. Healthcare designed for clarity.
                </p>
              </section>

              <section className="mt-10 rounded-2xl bg-[#eceef0] p-2 shadow-[0_12px_32px_rgba(25,28,30,0.04)]">
                <form className="grid grid-cols-[minmax(0,1fr)_200px_153px] gap-2" onSubmit={applySearch}>
                  <label className="relative">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#94a3b8]" />
                    <input
                      value={searchDraft}
                      onChange={(event) => {
                        setSearchDraft(event.target.value);
                        setSearchQuery(event.target.value);
                      }}
                      placeholder="Symptoms, specialist or doctor name"
                      aria-label="Search by symptom or doctor name"
                      className="h-14 w-full rounded-[12px] bg-white pl-12 pr-4 text-[16px] text-[#191c1e] outline-none placeholder:text-[#94a3b8]"
                    />
                  </label>
                  <label className="relative">
                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
                    <select
                      value={cityDraft}
                      onChange={(event) => {
                        const nextCity = event.target.value as (typeof cities)[number];
                        setCityDraft(nextCity);
                        setCityFilter(nextCity);
                      }}
                      aria-label="City"
                      className="h-14 w-full appearance-none rounded-[12px] bg-white pl-12 pr-10 text-[16px] text-[#191c1e] outline-none"
                    >
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
                  </label>
                  <button
                    type="submit"
                    className="h-14 rounded-[12px] bg-[linear-gradient(135deg,#0059bb_0%,#0070ea_100%)] text-[16px] font-bold tracking-[-0.4px] text-white"
                  >
                    Search Now
                  </button>
                </form>
              </section>

              <section className="mt-8 flex flex-wrap gap-3">
                {specialties.map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => setSpecialtyFilter(specialty)}
                    className={`rounded-full px-6 py-2 text-[14px] ${
                      specialtyFilter === specialty
                        ? "bg-[#0059bb] font-semibold text-white"
                        : "bg-[#e6e8ea] font-medium text-[#414754]"
                    }`}
                  >
                    {specialtyLabels[specialty]}
                  </button>
                ))}
              </section>

              <p className="mt-5 text-[14px] font-medium text-[#64748b]">
                Showing <span data-testid="results-count">{filteredDoctors.length}</span> doctors
              </p>

              <section className="mt-8">
                {filteredDoctors.length > 0 ? (
                  <div className="grid grid-cols-3 gap-8">
                    {filteredDoctors.map((doctor) => (
                      <DesktopDoctorCard key={doctor.id} doctor={doctor} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-[32px] bg-white p-12 text-center shadow-[0_12px_32px_rgba(25,28,30,0.04)]">
                    <p className="font-[family-name:var(--font-jakarta)] text-2xl font-bold">
                      No doctors match your filters
                    </p>
                    <p className="mt-3 text-[#64748b]">
                      Try another specialty, clear the search, or change the city.
                    </p>
                  </div>
                )}
              </section>
          </div>
        </div>

        <footer className="hidden">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between px-12 py-10">
            <div>
              <p className="font-[family-name:var(--font-jakarta)] text-[20px] font-bold text-[#0f172a]">
                MedEase
              </p>
              <p className="mt-4 text-[12px] uppercase tracking-[1.2px] text-[#94a3b8]">
                © 2024 MedEase Health Sanctuary. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-8 text-[12px] uppercase tracking-[1.2px] text-[#94a3b8]">
              <span className="underline">Privacy Policy</span>
              <span className="underline">Terms of Service</span>
              <span className="underline">Contact Support</span>
              <span className="underline">Careers</span>
            </div>
          </div>
        </footer>
        </>
      ) : (
        <>
          <header className="fixed inset-x-0 top-0 z-40 border-b border-[#f1f5f9] bg-white/80 backdrop-blur-[12px]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full bg-[#d8e2ff]">
                <Image
                  src={featuredDoctor?.photoUrl ?? "/next.svg"}
                  alt="User profile"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <p className="text-[18px] font-bold tracking-[-0.45px] text-[#191c1e]">MedEase</p>
            </div>
            <button type="button" aria-label="Open menu" className="text-[#1d4ed8]">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        <div className="px-6 pb-44 pt-24">
          <section>
            <h1 className="font-[family-name:var(--font-jakarta)] text-[36px] font-extrabold leading-[45px] tracking-[-0.9px] text-[#191c1e]">
              Find the specialized
              <br />
              <span className="text-[#0059bb]">care</span> you deserve.
            </h1>
          </section>

          <section className="mt-6 rounded-[32px] bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <form className="space-y-2" onSubmit={applySearch}>
              <label className="flex items-center rounded-2xl bg-[#f2f4f6] px-4 py-3">
                <Search className="h-[18px] w-[18px] text-[#64748b]" />
                <input
                  value={searchDraft}
                  onChange={(event) => {
                    setSearchDraft(event.target.value);
                    setSearchQuery(event.target.value);
                  }}
                  placeholder="Symptoms, specialist or doctor name..."
                  aria-label="Search by symptom or doctor name"
                  className="ml-3 h-10 w-full bg-transparent text-[16px] font-medium text-[#414754] outline-none placeholder:text-[#414754]"
                />
              </label>
              <label className="relative flex items-center rounded-2xl bg-[#f2f4f6] px-4 py-3">
                <MapPin className="h-[18px] w-[18px] text-[#64748b]" />
                <select
                  value={cityDraft}
                  onChange={(event) => {
                    const nextCity = event.target.value as (typeof cities)[number];
                    setCityDraft(nextCity);
                    setCityFilter(nextCity);
                  }}
                  aria-label="City"
                  className="ml-3 h-10 w-full appearance-none bg-transparent pr-8 text-[16px] font-medium text-[#191c1e] outline-none"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748b]" />
              </label>
              <button
                type="submit"
                className="flex h-14 w-full items-center justify-center rounded-full bg-[linear-gradient(170deg,#0059bb_0%,#0070ea_100%)] text-[16px] font-bold text-white shadow-[0_10px_15px_-3px_rgba(0,89,187,0.2),0_4px_6px_-4px_rgba(0,89,187,0.2)]"
              >
                Search Now
              </button>
            </form>
          </section>

          <section className="scrollbar-none mt-6 overflow-x-auto">
            <div className="flex min-w-max gap-3 pr-6">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => setSpecialtyFilter(specialty)}
                  className={`rounded-full px-6 py-2.5 text-[14px] font-semibold ${
                    specialtyFilter === specialty
                      ? "bg-[#0059bb] text-white"
                      : "bg-[#e6e8ea] text-[#414754]"
                  }`}
                >
                  {mobileSpecialtyLabels[specialty]}
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8 space-y-8">
            <p className="text-[14px] font-medium text-[#64748b]">
              Showing <span data-testid="results-count">{filteredDoctors.length}</span> doctors
            </p>

            {filteredDoctors.map((doctor) => <MobileDoctorCard key={doctor.id} doctor={doctor} />)}

            {filteredDoctors.length === 0 ? (
              <div className="rounded-[40px] bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <p className="font-[family-name:var(--font-jakarta)] text-[24px] font-bold text-[#191c1e]">
                  No doctors match your filters
                </p>
                <p className="mt-3 text-[14px] leading-6 text-[#64748b]">
                  Try another specialty, clear the search, or change the city.
                </p>
              </div>
            ) : null}
          </section>
        </div>

        <nav className="fixed inset-x-0 bottom-0 z-40 rounded-t-[32px] bg-white/90 px-4 pb-8 pt-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] backdrop-blur-[20px]">
          <div className="flex items-center justify-between">
            {mobileNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className={`flex min-w-[68px] flex-col items-center rounded-2xl px-5 py-2 ${
                    item.active ? "bg-[#eff6ff]" : ""
                  }`}
                >
                  <Icon
                    className={`h-[18px] w-[18px] ${
                      item.active ? "text-[#1d4ed8]" : "text-[#64748b]"
                    }`}
                  />
                  <span
                    className={`mt-1 text-[11px] font-semibold uppercase tracking-[0.55px] ${
                      item.active ? "text-[#1d4ed8]" : "text-[#64748b]"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </nav>
        </>
      )}
    </div>
  );
}
