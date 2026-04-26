"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/* ------------------------------------------------------------------
 * App Shell Entry — Persona-aware redirect
 * ------------------------------------------------------------------
 * In production, this resolves the user's primary role from Clerk/
 * session and redirects to the appropriate dashboard.
 * For now, defaults to investor dashboard (highest-engagement path).
 * ------------------------------------------------------------------ */

export default function AppEntryPage() {
  const router = useRouter();

  useEffect(() => {
    // TODO: Resolve user role from auth context
    // const role = await getUserRole();
    // if (role.startsWith("seller")) router.replace("/app/seller");
    // else if (role.startsWith("investor")) router.replace("/app/investor");
    // else router.replace("/app/investor");
    router.replace("/app/investor");
  }, [router]);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40,
          height: 40,
          border: "3px solid var(--border)",
          borderTopColor: "var(--gold)",
          borderRadius: "50%",
          margin: "0 auto 16px",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Loading your dashboard…</p>
      </div>
    </div>
  );
}
