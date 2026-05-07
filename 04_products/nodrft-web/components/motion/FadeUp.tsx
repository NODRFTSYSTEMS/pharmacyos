"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type PropsWithChildren } from "react";

type FadeUpProps = PropsWithChildren<{
  delay?: number;
  className?: string;
}>;

const BRAND_EASE = [0.16, 1, 0.3, 1] as const;

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const inView = useInView(ref, { once: true, margin: "-40px 0px 0px 0px" });

  if (prefersReduced) {
    return <div ref={ref} className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.6, ease: BRAND_EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
