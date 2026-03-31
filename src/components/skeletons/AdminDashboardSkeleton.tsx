import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function StatCardSkeleton() {
  return (
    <div className="rounded-[28px] border border-white/70 bg-white p-5 shadow-xl shadow-blue-950/5">
      <Skeleton circle height={20} width={20} />
      <div className="mt-4">
        <Skeleton height={36} width={64} />
      </div>
      <div className="mt-2">
        <Skeleton height={16} width={100} />
      </div>
    </div>
  );
}

function DoctorRowSkeleton() {
  return (
    <div className="rounded-[32px] bg-white p-6 shadow-xl shadow-blue-950/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <Skeleton height={28} width="55%" />
          <div className="mt-2">
            <Skeleton height={18} width="35%" />
          </div>
          <div className="mt-1">
            <Skeleton height={16} width="60%" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton height={40} width={72} borderRadius={12} />
          <Skeleton height={40} width={40} borderRadius={12} />
        </div>
      </div>

      {/* Weekly timings block */}
      <div className="mt-6 rounded-[28px] bg-slate-50 p-5">
        <div className="flex items-center justify-between">
          <Skeleton height={22} width={140} />
          <Skeleton height={38} width={110} borderRadius={12} />
        </div>
        <div className="mt-4 space-y-3">
          {Array.from({ length: 2 }, (_, i) => (
            <div key={i} className="grid grid-cols-5 gap-3">
              <Skeleton height={44} borderRadius={12} />
              <Skeleton height={44} borderRadius={12} />
              <Skeleton height={44} borderRadius={12} />
              <Skeleton height={44} borderRadius={12} />
              <Skeleton height={44} borderRadius={12} />
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Skeleton height={44} borderRadius={12} />
        </div>
      </div>
    </div>
  );
}

function AppointmentRowSkeleton() {
  return (
    <tr className="border-t border-slate-100">
      {Array.from({ length: 6 }, (_, i) => (
        <td key={i} className="py-4 pr-4">
          <Skeleton height={16} width={i === 1 ? 120 : 80} />
          {i === 1 && (
            <div className="mt-1">
              <Skeleton height={12} width={90} />
            </div>
          )}
        </td>
      ))}
    </tr>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">

      {/* Hero banner */}
      <section className="rounded-[32px] bg-slate-950 px-6 py-8 shadow-2xl shadow-blue-950/15">
        <Skeleton height={12} width={140} baseColor="#334155" highlightColor="#475569" />
        <div className="mt-3">
          <Skeleton height={36} width="70%" baseColor="#334155" highlightColor="#475569" />
          <div className="mt-1">
            <Skeleton height={36} width="45%" baseColor="#334155" highlightColor="#475569" />
          </div>
        </div>
        <div className="mt-3">
          <Skeleton height={18} width="55%" baseColor="#334155" highlightColor="#475569" />
        </div>
      </section>

      {/* Stat cards */}
      <section className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </section>

      {/* Main two-column section */}
      <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">

        {/* Add Doctor form */}
        <div className="rounded-[32px] bg-white p-6 shadow-xl shadow-blue-950/5">
          <Skeleton height={30} width={160} />
          <div className="mt-6 grid gap-4">
            {/* Name */}
            <div className="grid gap-1">
              <Skeleton height={12} width={80} />
              <Skeleton height={48} borderRadius={12} />
            </div>
            {/* Specialty */}
            <div className="grid gap-1">
              <Skeleton height={12} width={70} />
              <Skeleton height={48} borderRadius={12} />
            </div>
            {/* Qualifications */}
            <div className="grid gap-1">
              <Skeleton height={12} width={110} />
              <Skeleton height={48} borderRadius={12} />
            </div>
            {/* 2-col grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="grid gap-1">
                  <Skeleton height={12} width={90} />
                  <Skeleton height={48} borderRadius={12} />
                </div>
              ))}
            </div>
            {/* City */}
            <div className="grid gap-1">
              <Skeleton height={12} width={40} />
              <Skeleton height={48} borderRadius={12} />
            </div>
            {/* Photo URL */}
            <div className="grid gap-1">
              <Skeleton height={12} width={80} />
              <Skeleton height={48} borderRadius={12} />
            </div>
            {/* Checkboxes */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton height={16} width={16} borderRadius={4} />
                <Skeleton height={16} width={220} />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton height={16} width={16} borderRadius={4} />
                <Skeleton height={16} width={260} />
              </div>
            </div>
            {/* Submit button */}
            <Skeleton height={48} borderRadius={12} />
          </div>
        </div>

        {/* Doctor list */}
        <div className="space-y-6">
          {Array.from({ length: 3 }, (_, i) => (
            <DoctorRowSkeleton key={i} />
          ))}
        </div>
      </section>

      {/* Appointments table */}
      <section className="rounded-[32px] bg-white p-6 shadow-xl shadow-blue-950/5">
        <Skeleton height={30} width={240} />
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr>
                {["Doctor", "Patient", "Date", "Slot", "Payment", "Status"].map((h) => (
                  <th key={h} className="pb-3 pr-4">
                    <Skeleton height={14} width={60} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }, (_, i) => (
                <AppointmentRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
