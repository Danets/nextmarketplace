"use server";

import { prisma } from "@/lib/db";
import { getUserByEmail, getPasswordResetTokenByToken } from "@/lib/helpers";

import { z } from "zod";
import { NewPasswordFormSchema } from "@/lib/schemas";
import bcrypt from "bcryptjs";

type Schema = z.infer<typeof NewPasswordFormSchema>;

export const newPassword = async (values: Schema, token?: string | null) => {
  if (!token) {
    return { error: "Missing Token" };
  }

  const validatedFields = NewPasswordFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  const isExpiredToken = new Date(existingToken.expires) < new Date();

  if (isExpiredToken) {
    return { error: "Token is expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      password: hashedPassword,
    },
  });

  await prisma.passwordResetToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Password updated successfully" };
};
