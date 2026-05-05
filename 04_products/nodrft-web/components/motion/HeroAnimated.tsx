"use client";

import { motion, useReducedMotion } from "framer-motion";

const BRAND_EASE = [0.16, 1, 0.3, 1] as const;

const containerVariant = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04, delayChildren: 0.12 },
  },
};

const wordVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: BRAND_EASE },
  },
};

const blockVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: BRAND_EASE },
  },
};

function WordLine({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i, arr) => (
        <motion.span
          key={i}
          variants={wordVariant}
          style={{ display: "inline-block", marginRight: i < arr.length - 1 ? "0.3em" : 0 }}
        >
          {word}
        </motion.span>
      ))}
    </>
  );
}

interface HeroAnimatedProps {
  label: string;
  headline1: string;
  headline2: string;
  lead: string;
  ctaButton: string;
  ctaSecondary: string;
  locale: string;
}

export function HeroAnimated({
  label,
  headline1,
  headline2,
  lead,
  ctaButton,
  ctaSecondary,
  locale,
}: HeroAnimatedProps) {
  const prefersReduced = useReducedMotion();

  function lineProps(delay: number, axis: "x" | "y") {
    if (prefersReduced) return {};
    return {
      initial: axis === "x" ? { scaleX: 0 } : { scaleY: 0 },
      animate: axis === "x" ? { scaleX: 1 } : { scaleY: 1 },
      transition: { duration: 0.7, ease: BRAND_EASE, delay },
    };
  }

  function pathProps(delay: number) {
    if (prefersReduced) return {};
    return {
      initial: { pathLength: 0 },
      animate: { pathLength: 1 },
      transition: { duration: 1.2, ease: BRAND_EASE, delay },
    };
  }

  function fadeProps(delay: number) {
    if (prefersReduced) return {};
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.4, delay },
    };
  }

  return (
    <>
      {/* Structural grid lines */}
      <div className="nd-hero__grid" aria-hidden="true">
        <motion.div
          className="nd-hero__grid-line nd-hero__grid-line--h"
          style={{ top: "30%", transformOrigin: "left center" }}
          {...lineProps(0.05, "x")}
        />
        <motion.div
          className="nd-hero__grid-line nd-hero__grid-line--h"
          style={{ top: "65%", transformOrigin: "left center" }}
          {...lineProps(0.2, "x")}
        />
        <motion.div
          className="nd-hero__grid-line nd-hero__grid-line--v"
          style={{ left: "33%", transformOrigin: "center top" }}
          {...lineProps(0.1, "y")}
        />
        <motion.div
          className="nd-hero__grid-line nd-hero__grid-line--v"
          style={{ left: "66%", transformOrigin: "center top" }}
          {...lineProps(0.25, "y")}
        />
      </div>

      {/* Diamond SVG — path draw-on */}
      <svg
        className="nd-hero__accent"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <motion.path
          d="M60 4 L116 60 L60 116 L4 60 Z"
          stroke="var(--accent)"
          strokeWidth="1.5"
          fill="none"
          {...pathProps(0.15)}
        />
        <motion.path
          d="M60 18 L102 60 L60 102 L18 60 Z"
          stroke="var(--accent)"
          strokeWidth="0.75"
          fill="none"
          opacity={0.5}
          {...pathProps(0.45)}
        />
        <motion.path
          d="M60 4 L60 116"
          stroke="var(--border)"
          strokeWidth="0.5"
          {...fadeProps(1.1)}
        />
        <motion.path
          d="M4 60 L116 60"
          stroke="var(--border)"
          strokeWidth="0.5"
          {...fadeProps(1.2)}
        />
      </svg>

      {/* Hero copy — word stagger on headline, block fade on lead + CTAs */}
      <div className="nd-wrap">
        <motion.div
          initial={prefersReduced ? {} : "hidden"}
          animate={prefersReduced ? {} : "visible"}
          variants={containerVariant}
        >
          <motion.div
            className="nd-hero-label-wrap"
            variants={blockVariant}
          >
            <motion.div
              className="nd-hero-copper-bar"
              initial={prefersReduced ? {} : { scaleX: 0 }}
              animate={prefersReduced ? {} : { scaleX: 1 }}
              transition={{ duration: 0.5, ease: BRAND_EASE, delay: 0.08 }}
            />
            <p className="nd-label">{label}</p>
          </motion.div>

          <h1
            id="hero-heading"
            className="nd-h1"
            style={{ marginBottom: "var(--space-6)" }}
          >
            <span style={{ display: "block" }}>
              <WordLine text={headline1} />
            </span>
            <span style={{ display: "block" }}>
              <WordLine text={headline2} />
            </span>
          </h1>

          <motion.p
            className="nd-lead"
            style={{ maxWidth: "600px", marginBottom: "var(--space-8)" }}
            variants={blockVariant}
          >
            {lead}
          </motion.p>

          <motion.div className="nd-cta-row" variants={blockVariant}>
            <a href={`/${locale}/start`} className="btn">
              {ctaButton}
            </a>
            <a href={`/${locale}/capabilities`} className="btn--ghost">
              {ctaSecondary}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
