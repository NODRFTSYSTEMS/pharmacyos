"use client";

import { SignUp } from "@clerk/nextjs";
import { useEffect } from "react";
import { track } from "@/lib/events/track";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkConfigured =
  clerkKey.startsWith("pk_") && clerkKey !== "pk_test_replace_me" && clerkKey.length > 30;

export default function SignUpPage() {
  useEffect(() => {
    if (clerkConfigured) {
      track({ event: "signed_up", props: { method: "clerk" } });
    }
  }, []);

  if (!clerkConfigured) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          padding: "48px 16px",
          textAlign: "center",
          gap: "16px",
        }}
      >
        <div style={{ fontSize: "2rem" }}>🔧</div>
        <h1 style={{ fontFamily: "var(--display)", fontWeight: 700, color: "var(--text)" }}>
          Dev Mode
        </h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "40ch" }}>
          Clerk auth is not configured. Enable dev bypass to access protected routes without signing up.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "48px 16px",
      }}
    >
      <SignUp />
    </div>
  );
}
