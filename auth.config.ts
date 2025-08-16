import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

import bcrypt from "bcryptjs";

import { LoginFormSchema } from "./src/lib/schemas";
import { getUserByEmail } from "@/lib/helpers";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginFormSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;
        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const matchPassword = await bcrypt.compare(password, user.password);

        if (matchPassword) return user;

        return null;
      },
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
} satisfies NextAuthConfig;
