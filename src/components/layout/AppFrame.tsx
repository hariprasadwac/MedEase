"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AppFrameProps {
  children: React.ReactNode;
}

export function AppFrame({ children }: AppFrameProps) {
  const pathname = usePathname();
  const hideDefaultHeader = pathname === "/doctors" || pathname === "/booking";

  return (
    <div className="relative flex min-h-screen flex-col">
      {hideDefaultHeader ? null : (
        <header className="sticky top-0 z-40 border-b border-white/70 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
            <Link
              href="/doctors"
              className="font-[family-name:var(--font-jakarta)] text-2xl font-extrabold tracking-[-1.2px] text-[#1d4ed8]"
            >
              MedEase
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600"
              >
                Admin
              </Link>
            </div>
          </div>
        </header>
      )}
      <motion.main
        key={pathname}
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {children}
      </motion.main>
    </div>
  );
}
