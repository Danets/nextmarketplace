"use server";

import { prisma } from "@/lib/db";
import {
  createVerificationToken,
  getUserByEmail,
  getUserById,
} from "@/lib/helpers";
import { currentUser } from "@/lib/auth";

import { z } from "zod";
import { SettingsFormSchema } from "@/lib/schemas";
import { sendConfirmEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

type Schema = z.infer<typeof SettingsFormSchema>;

export const settings = async (values: Schema) => {
  const userSession = await currentUser();

  if (!userSession) {
    return {
      error: "User is not authenticated",
    };
  }

  const userDb = await getUserById(userSession.id as string);

  if (!userDb) {
    return {
      error: "User is not found",
    };
  }

  if (userSession?.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
  }

  if (values.email && values.email !== userSession.email) {
    const existingUser = await getUserByEmail(values.email);

    if (existingUser && existingUser.id !== userSession.id) {
      return {
        error: "Email is already in use",
      };
    }

    const verificationToken = await createVerificationToken(values.email);
    await sendConfirmEmail(verificationToken.email, verificationToken.token);

    return {
      success: "A confirmation email has been sent to your new email address.",
    };
  }

  if (values.password && values.newPassword && userDb.password) {
    const isPasswordMatched = await bcrypt.compare(
      values.password,
      userDb.password
    );

    if (!isPasswordMatched) {
      return {
        error: "Current password is incorrect",
      };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }

  await prisma.user.update({
    where: { id: userDb.id },
    data: {
      ...values,
    },
  });

  return {
    success: "Settings updated successfully",
  };
};
