"use server";

import { sendEmail } from "@/lib/email";

export async function sendInviteEmailAction(email: string, role: string) {
  try {
    const html = `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #000; font-weight: 900;">You've been invited to WORK</h2>
        <p>You have been granted access to join the workspace as a <strong>${role}</strong>.</p>
        <p>Click the button below to accept your invitation and access your dashboard.</p>
        <div style="margin: 30px 0;">
          <a href="https://work.engine" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Accept Invitation</a>
        </div>
        <p style="font-size: 12px; color: #888;">If you didn't expect this invitation, you can safely ignore this email.</p>
      </div>
    `;

    const result = await sendEmail({
      to: email,
      subject: "Invitation to join WORK",
      html: html,
    });

    if (!result.success) {
      console.error("Failed to send invite via Resend:", result.error);
      return { success: false, error: "Failed to dispatch email." };
    }

    return { success: true };
  } catch (error) {
    console.error("Server Action Exception:", error);
    return { success: false, error: "Internal server error." };
  }
}
