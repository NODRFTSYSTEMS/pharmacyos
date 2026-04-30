"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";

/* ------------------------------------------------------------------
 * App Shell Entry — Role-aware redirect
 * Sellers go to /app/seller; all others go to /app/investor.
 * ------------------------------------------------------------------ */

export default function AppEntryPage() {
  const router = useRouter();
  const { role, loading } = useUserRole();

  useEffect(() => {
    if (loading) return;
    if (role === "seller") {
      router.replace("/app/seller");
    } else {
      router.replace("/app/investor");
    }
  }, [router, role, loading]);

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
