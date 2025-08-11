import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { prisma } from "@/lib/db";
import { getUserById } from "@/lib/helpers";

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (existingUser) {
        token.role = existingUser.role;
      }

      console.log({ token, user });
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role;
      }
      console.log({ session, sessionToken: token });

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});
