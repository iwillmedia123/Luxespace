import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "";

// Initialize Resend client, falling back to null if no key is provided in development
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface EmailPayload {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

/**
 * Sends a transactional email using Resend
 */
export async function sendEmail({
  to,
  subject,
  html,
  from = "Luxespace Properties <noreply@luxespace.properties>",
  replyTo,
}: EmailPayload) {
  if (!resend) {
    console.warn("Resend API is not configured. Email was not sent.");
    return { data: null, error: new Error("RESEND_API_KEY is missing") };
  }

  try {
    const response = await resend.emails.send({
      from,
      to,
      subject,
      html,
      replyTo,
    });
    
    return { data: response.data, error: response.error };
  } catch (error) {
    console.error("Resend Email Sending Failed:", error);
    return { data: null, error };
  }
}
