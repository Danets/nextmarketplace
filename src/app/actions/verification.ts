"use server";

import { prisma } from "@/lib/db";
import { getUserByEmail, getVerificationTokenByToken } from "@/lib/helpers";

export const verify = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  const isExpiredToken = new Date(existingToken.expires) < new Date();

  if (isExpiredToken) {
    return { error: "Token is expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "User does not exist" };
  }

  await prisma.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await prisma.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: "Email verified successfully" };
};
