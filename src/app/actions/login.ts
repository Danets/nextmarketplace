"use server";

import { LoginFormSchema } from "@/lib/schemas";
import z from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/lib/helpers";
import { signIn } from "../../../auth";
import { DEFALT_REDIRECT } from "../../../routes";
import { AuthError } from "next-auth";

export async function login(values: z.infer<typeof LoginFormSchema>) {
  const validatedFields = LoginFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFALT_REDIRECT,
    });
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
