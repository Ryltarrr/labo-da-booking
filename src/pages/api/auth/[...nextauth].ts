import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  debug: true,
  session: {
    strategy: "jwt",
  },
  logger: {
    error: (code, metadata) => {
      console.error("nextauth", code, metadata);
    },
    warn: (code) => {
      console.warn("nextauth", code);
    },
    debug: (code, metadata) => {
      console.debug("nextauth", code, metadata);
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Email Ynov",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email Ynov",
          type: "text",
          placeholder: "jonathan.auvray@ynov.com",
        },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${env.NEXTAUTH_URL}/api/authenticate`, {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          });
          const user = await res.json();
          // If no error and we have user data, return it
          if (res.ok && user) {
            return user;
          }
          // Return null if user data could not be retrieved
          return null;
        } catch (err) {
          return null;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
