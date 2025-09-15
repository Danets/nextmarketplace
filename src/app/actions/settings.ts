"use server";

import { prisma } from "@/lib/db";
import { getUserById } from "@/lib/helpers";
import { currentUser } from "@/lib/auth";

import { z } from "zod";
import { SettingsFormSchema } from "@/lib/schemas";

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
