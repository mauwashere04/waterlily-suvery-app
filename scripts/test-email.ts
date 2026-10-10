import "dotenv/config";
import { Resend } from "resend";

async function main() {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ADMIN_EMAIL;
  const from =
    process.env.EMAIL_FROM ?? "Waterlily Intake <onboarding@resend.dev>";

  if (!apiKey) {
    console.error("RESEND_API_KEY is missing from .env");
    process.exit(1);
  }
  if (!to) {
    console.error("ADMIN_EMAIL is missing from .env");
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to,
    subject: "Resend test",
    text: "It works.",
  });

  console.log(JSON.stringify(result, null, 2));
  if (result.error) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
