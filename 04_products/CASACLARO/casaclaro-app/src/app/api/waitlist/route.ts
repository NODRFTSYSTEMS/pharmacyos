import { NextRequest, NextResponse } from "next/server";

interface WaitlistEntry {
  email: string;
  intent: string;
  source: string;
  submittedAt: string;
}

async function notifyViaResend(entry: WaitlistEntry) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const notifyEmail = process.env.CASACLARO_NOTIFY_EMAIL ?? "hello@casaclaro.co";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "CasaClaro <noreply@casaclaro.co>",
      to: [notifyEmail],
      subject: `New waitlist signup — ${entry.intent}`,
      html: `
        <p><strong>Email:</strong> ${entry.email}</p>
        <p><strong>Intent:</strong> ${entry.intent}</p>
        <p><strong>Source:</strong> ${entry.source}</p>
        <p><strong>Time:</strong> ${entry.submittedAt}</p>
      `,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, intent, source } = body as {
      email?: string;
      intent?: string;
      source?: string;
    };

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const entry: WaitlistEntry = {
      email: email.toLowerCase().trim(),
      intent: intent ?? "unknown",
      source: source ?? "unknown",
      submittedAt: new Date().toISOString(),
    };

    // Log to console — always captured by Vercel Functions logs
    console.log("[waitlist]", JSON.stringify(entry));

    // Send Resend notification if key is configured
    await notifyViaResend(entry).catch((err) =>
      console.error("[waitlist] Resend failed:", err)
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[waitlist] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
