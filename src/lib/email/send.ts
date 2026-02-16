import { Resend } from "resend";

type EmailPayload = {
  to: string | string[];
  subject: string;
  html: string;
};

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new Resend(apiKey);
}

function getEmailFrom(): string {
  return process.env.EMAIL_FROM ?? "Snap Plan Designs <noreply@example.com>";
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    return;
  }

  await resend.emails.send({
    from: getEmailFrom(),
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  });
}

export async function sendOrderPaidEmail(to: string, projectUrl: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Payment received - next step",
    html: `<p>Your payment is confirmed.</p><p>Continue your intake: <a href=\"${projectUrl}\">Open project</a></p>`,
  });
}

export async function sendNeedsInfoEmail(to: string, projectUrl: string): Promise<void> {
  await sendEmail({
    to,
    subject: "More information needed",
    html: `<p>We need more details to continue your project.</p><p><a href=\"${projectUrl}\">Open project</a></p>`,
  });
}

export async function sendDeliveredEmail(to: string, projectUrl: string): Promise<void> {
  await sendEmail({
    to,
    subject: "Your deliverables are ready",
    html: `<p>Your plan and notes are published.</p><p><a href=\"${projectUrl}\">View deliverables</a></p>`,
  });
}
