import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

type AnswerForEmail = { title: string; value: string };

function summaryTable(answers: AnswerForEmail[]): string {
  const rows = answers
    .map(
      (a) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#555;">${a.title}</td><td style="padding:4px 0;"><strong>${a.value}</strong></td></tr>`
    )
    .join("");
  return `<table cellpadding="0" cellspacing="0">${rows}</table>`;
}

/**
 * Emails a confirmation to the user and a notification to ADMIN_EMAIL after
 * a successful submission. Failures are logged, not thrown -- the
 * submission itself has already been written to the database by the time
 * this runs, and a flaky email provider must never turn a saved submission
 * into a 500 for the user.
 */
export async function sendSubmissionEmails(params: {
  userEmail: string;
  answers: AnswerForEmail[];
}): Promise<void> {
  if (!resend) {
    console.warn("RESEND_API_KEY not set; skipping submission emails.");
    return;
  }

  const from = process.env.EMAIL_FROM ?? "Waterlily Intake <onboarding@resend.dev>";
  const table = summaryTable(params.answers);

  try {
    await resend.emails.send({
      from,
      to: params.userEmail,
      subject: "We received your long-term care intake form",
      html: `<p>Thanks for completing the Long-term care intake form. Here is a copy of what you submitted:</p>${table}`,
    });
  } catch (error) {
    console.error("Failed to send user confirmation email", error);
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;

  try {
    await resend.emails.send({
      from,
      to: adminEmail,
      subject: `New intake submission: ${params.userEmail}`,
      html: `<p>${params.userEmail} just submitted the intake form.</p>${table}`,
    });
  } catch (error) {
    console.error("Failed to send admin notification email", error);
  }
}
