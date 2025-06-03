"use server";

import { RegisterFormSchema } from "@/lib/schemas";
import z from "zod";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/db";

export async function register(values: z.infer<typeof RegisterFormSchema>) {
  const validatedFields = RegisterFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      message: "Invalid form data",
    };
  }

  const { username, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    return { message: "Email already exists" };
  }

  await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return {
    message: "Account created successfully",
  };
}
