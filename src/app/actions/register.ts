"use server";

import { RegisterFormSchema } from "@/lib/schemas";
import z from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { createVerificationToken, getUserByEmail } from "@/lib/helpers";
import { mailer } from "@/lib/mail";

export async function register(values: z.infer<typeof RegisterFormSchema>) {
  const validatedFields = RegisterFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid form data",
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await getUserByEmail(email);

  if (user) {
    return { error: "Email already exists" };
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = await createVerificationToken(email);

  await mailer(token.email, token.token);

  return {
    success: "Confirmation email sent",
  };
}
