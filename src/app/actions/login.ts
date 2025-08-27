"use server";

import { LoginFormSchema } from "@/lib/schemas";
import z from "zod";
import { signIn } from "../../../auth";
import { DEFAULT_REDIRECT } from "../../../routes";
import { AuthError } from "next-auth";
import { createVerificationToken, getUserByEmail } from "@/lib/helpers";
import { sendConfirmEmail } from "@/lib/mail";

export async function login(values: z.infer<typeof LoginFormSchema>) {
  const validatedFields = LoginFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { email, password } = validatedFields.data;

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
