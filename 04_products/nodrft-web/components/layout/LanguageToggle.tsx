"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/navigation";
import { useTransition } from "react";
import { routing, type Locale } from "@/i18n/routing";

export function LanguageToggle() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const opposite: Locale = locale === "en" ? "es" : "en";
  const label =
    locale === "en" ? "ES — Cambiar a Español" : "EN — Switch to English";

  function switchLocale() {
    startTransition(() => {
      // next-intl router understands locale — pass current path without locale prefix
      router.push(pathname, { locale: opposite });
    });
  }

  if (!routing.locales.includes(opposite)) return null;

  return (
    <button
      onClick={switchLocale}
      disabled={isPending}
      aria-label={label}
      style={{
        border: "1px solid var(--border)",
        padding: "5px 12px",
        fontFamily: "var(--nd-font-mono, monospace)",
        fontSize: "11px",
        fontWeight: 500,
        color: "var(--text-md)",
        background: "var(--bg)",
        letterSpacing: "0.04em",
        cursor: "pointer",
        transition: "all var(--transition-fast)",
        minHeight: "44px",
        minWidth: "44px",
        position: "relative",
        opacity: isPending ? 0.6 : 1,
      }}
    >
      {opposite.toUpperCase()}
    </button>
  );
}
