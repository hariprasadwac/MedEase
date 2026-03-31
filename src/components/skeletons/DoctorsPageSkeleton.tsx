import Skeleton from "react-loading-skeleton";

function DesktopDoctorCardSkeleton() {
  return (
    <div className="flex min-h-[432px] flex-col rounded-[32px] bg-white p-6 shadow-[0_12px_32px_rgba(25,28,30,0.04)]">
      <div className="mb-6 flex items-start justify-between">
        <Skeleton circle height={80} width={80} />
        <Skeleton height={30} width={130} borderRadius={999} />
      </div>
      <Skeleton height={28} width="66%" />
      <div className="mt-2">
        <Skeleton height={20} width="42%" />
      </div>
      <div className="mt-8 space-y-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <Skeleton height={18} width={96} />
            <Skeleton height={18} width={132} />
          </div>
        ))}
      </div>
      <div className="mt-auto pt-8">
        <Skeleton height={56} borderRadius={24} />
      </div>
    </div>
  );
}

function MobileDoctorCardSkeleton() {
  return (
    <div className="rounded-[40px] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <div className="mb-6 flex items-start gap-5">
        <Skeleton circle height={80} width={80} />
        <div className="min-w-0 flex-1 pt-1">
          <Skeleton height={20} width={120} />
          <div className="mt-3">
            <Skeleton height={25} width="72%" />
          </div>
          <div className="mt-2">
            <Skeleton height={18} width="55%" />
          </div>
        </div>
      </div>
      <div className="mb-8 space-y-4">
        <Skeleton height={18} width="82%" />
        <Skeleton height={18} width="68%" />
        <Skeleton height={18} width="74%" />
      </div>
      <Skeleton height={56} borderRadius={24} />
    </div>
  );
}

export function DoctorsPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <div className="hidden lg:block">
        <header className="fixed inset-x-0 top-0 z-40 border-b border-[#f1f5f9] bg-white/80 backdrop-blur-[10px]">
          <div className="mx-auto flex h-20 w-full max-w-[1440px] items-center justify-between px-8">
            <Skeleton height={32} width={136} />
            <div className="flex items-center gap-4">
              <Skeleton circle height={36} width={36} />
              <Skeleton circle height={36} width={36} />
              <Skeleton circle height={40} width={40} />
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1440px] px-8 py-12 pt-[128px]">
          <div>
            <Skeleton height={44} width={320} />
            <div className="mt-4">
              <Skeleton height={22} width="58%" count={2} />
            </div>

            <section className="mt-10 rounded-2xl bg-[#eceef0] p-2 shadow-[0_12px_32px_rgba(25,28,30,0.04)]">
              <div className="grid grid-cols-[minmax(0,1fr)_200px_153px] gap-2">
                <Skeleton height={56} borderRadius={12} />
                <Skeleton height={56} borderRadius={12} />
                <Skeleton height={56} borderRadius={12} />
              </div>
            </section>

            <section className="mt-8 flex flex-wrap gap-3">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton key={index} height={40} width={136} borderRadius={999} />
              ))}
            </section>

            <div className="mt-5">
              <Skeleton height={18} width={156} />
            </div>

            <section className="mt-8 grid grid-cols-3 gap-8">
              {Array.from({ length: 6 }, (_, index) => (
                <DesktopDoctorCardSkeleton key={index} />
              ))}
            </section>
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <header className="fixed inset-x-0 top-0 z-40 border-b border-[#f1f5f9] bg-white/80 px-6 py-4 backdrop-blur-[12px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton circle height={40} width={40} />
              <Skeleton height={24} width={96} />
            </div>
            <Skeleton circle height={24} width={24} />
          </div>
        </header>

        <div className="px-6 pb-44 pt-24">
          <Skeleton height={45} width="90%" count={2} />

          <section className="mt-6 rounded-[32px] bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="space-y-2">
              <Skeleton height={64} borderRadius={24} />
              <Skeleton height={64} borderRadius={24} />
              <Skeleton height={56} borderRadius={999} />
            </div>
          </section>

          <section className="mt-6 flex gap-3 overflow-hidden">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} height={42} width={110} borderRadius={999} />
            ))}
          </section>

          <section className="mt-8 space-y-8">
            <Skeleton height={18} width={156} />
            {Array.from({ length: 4 }, (_, index) => (
              <MobileDoctorCardSkeleton key={index} />
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
