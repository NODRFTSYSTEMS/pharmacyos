import { SignIn } from "@clerk/nextjs";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkConfigured =
  clerkKey.startsWith("pk_") && clerkKey !== "pk_test_replace_me" && clerkKey.length > 30;

export default function SignInPage() {
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
          Clerk auth is not configured. Enable dev bypass to access protected routes without signing in.
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
      <SignIn />
    </div>
  );
}
