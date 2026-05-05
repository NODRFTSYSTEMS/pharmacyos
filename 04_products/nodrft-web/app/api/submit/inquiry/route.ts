import { NextRequest, NextResponse } from "next/server";

const REQUIRED = ["name", "email", "body", "urgency"] as const;

function validate(body: Record<string, unknown>): string | null {
  for (const key of REQUIRED) {
    if (!body[key] || String(body[key]).trim() === "") {
      return `Missing required field: ${key}`;
    }
  }
  const email = String(body.email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Invalid email address";
  }
  return null;
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json({ ok: false, error: validationError }, { status: 400 });
  }

  const webhookUrl = process.env.FORM_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("FORM_WEBHOOK_URL not configured");
    return NextResponse.json({ ok: false, error: "Service unavailable" }, { status: 503 });
  }

  try {
    const params = new URLSearchParams({
      "form-kind": "inquiry",
      name: String(body.name).trim(),
      email: String(body.email).trim(),
      org: body.org ? String(body.org).trim() : "",
      body: String(body.body).trim(),
      urgency: String(body.urgency).trim(),
      locale: String(body.locale ?? "en"),
      submittedAt: new Date().toISOString(),
    });
    const fwdRes = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    if (!fwdRes.ok) {
      console.error("Webhook forward failed", fwdRes.status);
      return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
    }
  } catch (err) {
    console.error("Webhook error", err);
    return NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
