import { NextRequest, NextResponse } from "next/server";

async function notifyViaResend(payload: Record<string, string>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const notifyEmail = process.env.CASACLARO_NOTIFY_EMAIL ?? "hello@casaclaro.co";
  const subject =
    payload.type === "seller"
      ? `New seller submission — ${payload.city ?? "unknown city"}`
      : `New agent/partner application — ${payload.role ?? "unknown role"}`;

  const rows = Object.entries(payload)
    .map(([k, v]) => `<tr><td style="padding:4px 8px;font-weight:600">${k}</td><td style="padding:4px 8px">${v}</td></tr>`)
    .join("");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "CasaClaro <noreply@casaclaro.co>",
      to: [notifyEmail],
      subject,
      html: `<table style="font-family:system-ui;font-size:14px">${rows}</table>`,
    }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Record<string, string>;

    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (!["seller", "agent"].includes(body.type ?? "")) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const payload = {
      ...body,
      submittedAt: new Date().toISOString(),
    };

    console.log("[contact]", JSON.stringify(payload));

    await notifyViaResend(payload).catch((err) =>
      console.error("[contact] Resend failed:", err)
    );

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
