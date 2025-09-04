"use server";

import { LoginFormSchema } from "@/lib/schemas";
import z from "zod";
import { signIn } from "../../../auth";
import { DEFAULT_REDIRECT } from "../../../routes";
import { AuthError } from "next-auth";
import {
  createVerificationToken,
  generateTwoFactorToken,
  getTwoFactorConfirmationByUserId,
  getTwoFactorTokenByEmail,
  getUserByEmail,
} from "@/lib/helpers";
import { sendConfirmEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { prisma } from "@/lib/db";

export async function login(values: z.infer<typeof LoginFormSchema>) {
  const validatedFields = LoginFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "User does not exist!" };
  }

  if (!existingUser.emailVerified) {
    const token = await createVerificationToken(existingUser.email);

    await sendConfirmEmail(token.email, token.token);

    return {
      success: "Confirmation email sent",
    };
  }

  if (existingUser.email && existingUser.isTwoFactorEnabled) {
    if (code) {
      const twoFactorCode = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorCode) {
        return { error: "Invalid two factor code" };
      }

      if (twoFactorCode.token !== code) {
        return { error: "Invalid two factor code" };
      }

      const expiredToken = new Date(twoFactorCode.expires) < new Date();

      if (expiredToken) {
        return { error: "Two factor code expired. Please login again." };
      }

      await prisma.twoFactorToken.delete({
        where: { id: twoFactorCode.id },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmation) {
        await prisma.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id },
        });
      }

      await prisma.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const token = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorTokenEmail(token.email, token.token);

      return {
        twoFactor: true,
      };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_REDIRECT,
    });

    return {
      success: "Logged in successfully",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        default:
          return { error: "An unexpected error occurred" };
      }
    }
    throw error; // Re-throw if it's not an AuthError
  }
}
