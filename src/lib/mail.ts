import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendConfirmEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/verify?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "Confirmation email",
    html: `<p>Click the link below to confirm your email address:<a href="${confirmLink}">Confirm Email</a></p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/new-password?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [email],
    subject: "Reset your password",
    html: `<p>Click the link below to reset your password:<a href="${resetLink}">reset password</a></p>`,
  });
};
