import Skeleton from "react-loading-skeleton";

function DesktopSummarySkeleton() {
  return (
    <aside className="rounded-[32px] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <Skeleton height={28} width={180} />
      <div className="mt-4 rounded-[20px] bg-[#f2f4f6] p-4">
        <div className="flex items-center gap-3">
          <Skeleton height={64} width={64} borderRadius={16} />
          <div className="flex-1">
            <Skeleton height={24} width="72%" />
            <div className="mt-2">
              <Skeleton height={18} width="50%" />
            </div>
            <div className="mt-2">
              <Skeleton height={16} width="45%" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 space-y-5">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex items-center gap-3">
            <Skeleton circle height={40} width={40} />
            <div className="flex-1">
              <Skeleton height={14} width={72} />
              <div className="mt-2">
                <Skeleton height={20} width="75%" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 border-t border-dashed border-[#c1c6d7] pt-5">
        <div className="space-y-3">
          <Skeleton height={20} width="100%" />
          <Skeleton height={20} width="100%" />
          <Skeleton height={70} borderRadius={12} />
        </div>
      </div>
    </aside>
  );
}

export function BookingPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <div className="hidden lg:block">
        <header className="fixed inset-x-0 top-0 z-40 border-b border-[#f1f5f9] bg-white/80 backdrop-blur-[12px]">
          <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-8">
            <Skeleton height={32} width={136} />
            <div className="flex items-center gap-4">
              <Skeleton circle height={36} width={36} />
              <Skeleton circle height={32} width={32} />
            </div>
          </div>
        </header>

        <div className="mx-auto w-full max-w-[1152px] px-6 pb-16 pt-28 lg:px-8">
          <Skeleton height={48} width="100%" borderRadius={999} />
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="rounded-[32px] bg-white p-8 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
              <Skeleton height={32} width={220} />
              <div className="mt-6 grid grid-cols-5 gap-3">
                {Array.from({ length: 5 }, (_, index) => (
                  <Skeleton key={index} height={88} borderRadius={24} />
                ))}
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <Skeleton key={index} height={66} borderRadius={20} />
                ))}
              </div>
              <div className="mt-10 flex justify-end">
                <Skeleton height={56} width={168} borderRadius={999} />
              </div>
            </div>
            <DesktopSummarySkeleton />
          </div>
        </div>
      </div>

      <div className="lg:hidden">
        <header className="fixed inset-x-0 top-0 z-40 border-b border-[#f1f5f9] bg-white/80 px-6 py-4 backdrop-blur-[12px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton circle height={16} width={16} />
              <Skeleton height={24} width={96} />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton circle height={20} width={20} />
              <Skeleton circle height={32} width={32} />
            </div>
          </div>
        </header>

        <div className="px-6 pb-28 pt-24">
          <Skeleton height={36} width="100%" borderRadius={999} />
          <div className="mt-8 rounded-[32px] bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <Skeleton height={28} width={180} />
            <div className="mt-6 flex gap-3 overflow-hidden">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} height={84} width={90} borderRadius={24} />
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }, (_, index) => (
                <Skeleton key={index} height={64} borderRadius={20} />
              ))}
            </div>
          </div>
          <div className="mt-8">
            <Skeleton height={56} borderRadius={999} />
          </div>
        </div>
      </div>
    </div>
  );
}
