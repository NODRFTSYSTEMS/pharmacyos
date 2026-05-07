"use client";

import { motion, useReducedMotion } from "framer-motion";

const BRAND_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * PageTransition — motion wrapper for route transitions.
 *
 * Must be rendered as a direct child of AnimatePresence (provided by AnimatedLayout).
 * AnimatePresence keys this component via the pathname prop on the parent — no
 * internal pathname dependency needed here.
 *
 * If the user prefers reduced motion, children render immediately with no animation.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ clipPath: "inset(0 100% 0 0)", opacity: 1 }}
      animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        clipPath: { duration: 0.28, ease: BRAND_EASE },
        opacity: { duration: 0.12 },
      }}
    >
      {children}
    </motion.div>
  );
}
