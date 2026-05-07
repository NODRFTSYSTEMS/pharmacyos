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
          // display and marginRight are Framer Motion animation-enabling requirements:
          // motion.span must be inline-block to receive y-axis transforms, and word
          // spacing cannot be handled via CSS gap on an inline flow. No utility class
          // or design token covers this specific per-word stagger layout need.
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
      // Capped at 0.4s per 400ms animation duration limit
      transition: { duration: 0.4, ease: BRAND_EASE, delay },
    };
  }

  function pathProps(delay: number) {
    if (prefersReduced) return {};
    return {
      initial: { pathLength: 0 },
      animate: { pathLength: 1 },
      // Capped at 0.4s per 400ms animation duration limit
      transition: { duration: 0.4, ease: BRAND_EASE, delay },
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
      {/* Structural grid lines — aria-hidden, decorative only */}
      <div className="nd-hero__grid" aria-hidden="true">
        <motion.div
          className="nd-hero__grid-line nd-hero__grid-line--h"
          // top: "30%" is a decorative positional value; no design token or utility
          // class maps to this specific percentage. transformOrigin is animation-enabling.
          style={{ top: "30%", transformOrigin: "left center" }}
          {...lineProps(0.05, "x")}
        />
        <motion.div
          className="nd-hero__grid-line nd-hero__grid-line--h"
          // top: "65%" — same justification as above
          style={{ top: "65%", transformOrigin: "left center" }}
          {...lineProps(0.2, "x")}
        />
        <motion.div
          className="nd-hero__grid-line nd-hero__grid-line--v"
          // left: "33%" — decorative grid position; transformOrigin is animation-enabling
          style={{ left: "33%", transformOrigin: "center top" }}
          {...lineProps(0.1, "y")}
        />
        <motion.div
          className="nd-hero__grid-line nd-hero__grid-line--v"
          // left: "66%" — same justification as above
          style={{ left: "66%", transformOrigin: "center top" }}
          {...lineProps(0.25, "y")}
        />
      </div>

      {/* Diamond SVG — path draw-on, decorative */}
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
          {...pathProps(0.3)}
        />
        <motion.path
          d="M60 4 L60 116"
          stroke="var(--border)"
          strokeWidth="0.5"
          {...fadeProps(0.35)}
        />
        <motion.path
          d="M4 60 L116 60"
          stroke="var(--border)"
          strokeWidth="0.5"
          {...fadeProps(0.38)}
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
              transition={{ duration: 0.4, ease: BRAND_EASE, delay: 0.08 }}
            />
            <p className="nd-label">{label}</p>
          </motion.div>

          <h1
            id="hero-heading"
            className="nd-h1 nd-mb6"
          >
            {/* "block" is a Tailwind display utility — needed to force each line
                to occupy its own row within the inline word-stagger flow. */}
            <span className="block">
              <WordLine text={headline1} />
            </span>
            <span className="block">
              <WordLine text={headline2} />
            </span>
          </h1>

          <motion.p
            className="nd-lead nd-mb8"
            // maxWidth: "600px" is a hero-specific layout constraint. No design token
            // or existing utility class maps to exactly 600px (--max-width-narrow is 680px).
            style={{ maxWidth: "600px" }}
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
