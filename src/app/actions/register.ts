"use server";

import { RegisterFormSchema } from "@/lib/schemas";
import z from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

export async function register(values: z.infer<typeof RegisterFormSchema>) {
  // Validate form fields
  const validatedFields = RegisterFormSchema.safeParse(values);

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const isEmailExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isEmailExists) {
    return;
  }

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return {
    success: "User registered successfully",
    data: user,
  };
}
