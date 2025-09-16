import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { prisma } from "@/lib/db";

// declare module "@auth/core/jwt" {
//   interface JWT {
//     isOAuth?: boolean;
//     role?: string;
//     name?: string;
//     email?: string;
//   }
// }

// declare module "next-auth" {
//   interface Session {
//     user: {
//       isOAuth?: boolean;
//       id?: string;
//       role?: string;
//       name?: string | null;
//       email?: string | null;
//     };
//   }
// }

import {
  getAccountByUserId,
  getTwoFactorConfirmationByUserId,
  getUserById,
} from "@/lib/helpers";

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/sign-in",
    error: "/error",
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth sign in without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user?.id as string);

      if (!existingUser?.emailVerified) return false;

      if (existingUser?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!twoFactorConfirmation) return false;

        await prisma.twoFactorConfirmation.delete({
          where: { id: twoFactorConfirmation.id },
        });
      }

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isOAuth = !!existingAccount;

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }

      if (session.user && token.role) {
        session.user.role = token.role;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email ?? "";
        session.user.isOAuth = token.isOAuth;
      }

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
