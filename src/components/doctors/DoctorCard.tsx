"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Star, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatSlotLabel } from "@/lib/booking";
import type { Doctor } from "@/types";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const router = useRouter();
  const nextAvailability = doctor.availability?.[0]?.startTime;

  return (
    <article className="rounded-[28px] border border-white/70 bg-white p-5 shadow-xl shadow-blue-950/5">
      <div className="flex gap-4">
        <div className="w-24 shrink-0 text-center">
          <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-4 border-blue-50">
            <Image
              src={doctor.photoUrl}
              alt={doctor.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
          {doctor.availableToday ? (
            <Badge variant="success" className="mt-3" data-testid="available-today-badge">
              Available Today
            </Badge>
          ) : null}
        </div>
        <div className="flex-1 space-y-2">
          <div>
            <h2 className="font-[family-name:var(--font-jakarta)] text-xl font-bold text-slate-900">
              {doctor.name}
            </h2>
            <p className="font-semibold text-blue-600">{doctor.specialty}</p>
            <p className="text-sm text-slate-500">{doctor.qualifications}</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span>{doctor.experience} years experience</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4 text-blue-600" />
              {doctor.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <Wallet className="h-4 w-4 text-blue-600" />
              INR {doctor.consultationFee} / consultation
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-amber-500">
              {Array.from({ length: Math.floor(doctor.rating) }, (_, index) => (
                <Star key={index} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="font-semibold text-slate-800">{doctor.rating.toFixed(1)}</span>
            <span className="text-slate-600">({doctor.reviewCount} reviews)</span>
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
            Next available: {formatSlotLabel(nextAvailability ?? "09:00")}
          </p>
        </div>
      </div>
      <Button
        fullWidth
        className="mt-5"
        onClick={() => router.push(`/booking?doctorId=${doctor.id}`)}
      >
        Book Appointment
      </Button>
    </article>
  );
}
