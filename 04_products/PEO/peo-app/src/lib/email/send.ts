import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@peakequityoptimizer.com";

interface SendResult {
  ok: boolean;
  error?: string;
}

export async function sendWelcomeEmail(to: string): Promise<SendResult> {
  if (!resend) return { ok: false, error: "RESEND_API_KEY not configured" };

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Welcome to Peak Equity Optimizer",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #070a10; color: #e8e3d7;">
        <div style="margin-bottom: 24px;">
          <span style="display: inline-block; background: #C9A84C; color: #070a10; font-weight: 800; font-size: 14px; padding: 8px 14px; border-radius: 6px; letter-spacing: 0.05em;">PEO</span>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; color: #e8e3d7; margin: 0 0 12px;">Your account is ready.</h1>
        <p style="font-size: 15px; color: #9ca3af; line-height: 1.6; margin: 0 0 24px;">
          You now have access to the free estimator for seller net proceeds, investor MAO, BRRRR, and wholesale calculations.
          When you're ready for verified ARV and live comps, upgrade to a paid analysis.
        </p>
        <a href="https://peakequityoptimizer.com/en/estimator"
           style="display: inline-block; background: #C9A84C; color: #070a10; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
          Run Your First Analysis →
        </a>
        <p style="font-size: 12px; color: #6b7280; margin-top: 32px; line-height: 1.5;">
          Peak Equity Optimizer · Real estate deal intelligence for sellers and investors<br>
          You received this because you created an account.
        </p>
      </div>
    `,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function sendApplicationConfirmationEmail(
  to: string,
  applicationId: string,
  address: string
): Promise<SendResult> {
  if (!resend) return { ok: false, error: "RESEND_API_KEY not configured" };

  const { error } = await resend.emails.send({
    from: FROM,
    to,
    subject: "Your seller analysis is being prepared",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #070a10; color: #e8e3d7;">
        <div style="margin-bottom: 24px;">
          <span style="display: inline-block; background: #C9A84C; color: #070a10; font-weight: 800; font-size: 14px; padding: 8px 14px; border-radius: 6px; letter-spacing: 0.05em;">PEO</span>
        </div>
        <h1 style="font-size: 22px; font-weight: 700; color: #e8e3d7; margin: 0 0 12px;">Application received.</h1>
        <p style="font-size: 15px; color: #9ca3af; line-height: 1.6; margin: 0 0 8px;">
          We received your seller analysis application. Your triage and readiness plan will be ready shortly.
        </p>
        <div style="background: #0f1520; border: 1px solid #1e2535; border-radius: 8px; padding: 16px; margin: 20px 0; font-family: monospace; font-size: 13px; color: #C9A84C;">
          ${address}
        </div>
        <a href="https://peakequityoptimizer.com/en/seller/application/${applicationId}"
           style="display: inline-block; background: #C9A84C; color: #070a10; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 8px; text-decoration: none;">
          View Your Analysis →
        </a>
        <p style="font-size: 12px; color: #6b7280; margin-top: 32px; line-height: 1.5;">
          Peak Equity Optimizer · Application ID: ${applicationId}
        </p>
      </div>
    `,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
