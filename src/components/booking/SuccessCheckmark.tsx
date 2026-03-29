"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function SuccessCheckmark({ open }: { open: boolean }) {
  const router = useRouter();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-[32px] bg-white p-10 text-center shadow-2xl">
            <svg
              viewBox="0 0 120 120"
              className="mx-auto h-28 w-28"
              aria-hidden="true"
            >
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="#16A34A"
                className="checkmark-circle"
              />
              <path
                d="M34 62l17 17 35-38"
                fill="none"
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="10"
                className="checkmark-path"
              />
            </svg>
            <div className="checkmark-text mt-6 space-y-2">
              <h2 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold text-slate-900">
                Appointment Confirmed!
              </h2>
              <p className="text-slate-500">
                You will receive a confirmation shortly.
              </p>
              <Button fullWidth className="mt-5" onClick={() => router.push("/doctors")}>
                Book Another Appointment
              </Button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
