import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

import bcrypt from "bcrypt";

import { LoginFormSchema } from "./src/lib/schemas";
import { getUserByEmail } from "@/lib/helpers";

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = LoginFormSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) return null;

          const matchPassword = await bcrypt.compare(password, user.password);

          if (matchPassword) return user;

          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
