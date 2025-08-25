"use server";

import { ResetFormSchema } from "@/lib/schemas";
import z from "zod";
import { createPasswordResetToken, getUserByEmail } from "@/lib/helpers";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function reset(values: z.infer<typeof ResetFormSchema>) {
  const validatedFields = ResetFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email was not found!" };
  }

  const token = await createPasswordResetToken(email);

  await sendPasswordResetEmail(token.email, token.token);

  return { success: "Reset Email was sent" };
}
