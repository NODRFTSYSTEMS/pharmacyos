"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { PageTransition } from "@/components/motion/PageTransition";

/**
 * AnimatedLayout — client wrapper that drives route transition animations.
 *
 * Owns AnimatePresence so the Server Component layout.tsx does not require
 * the "use client" directive. AnimatePresence detects when PageTransition's
 * internal key (pathname) changes and triggers enter/exit sequences.
 *
 * Wraps {children} only — Nav and Footer are intentionally outside this wrapper.
 */
export function AnimatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <PageTransition key={pathname}>
        {children}
      </PageTransition>
    </AnimatePresence>
  );
}
