import { AuthOptions, DefaultSession, getServerSession } from "next-auth";
import SlackProvider from "next-auth/providers/slack";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "server/db";
import { env } from "env.mjs";
import { SpaceRole } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      roles: SpaceRole[];
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth",
  },
  providers: [
    SlackProvider({
      clientId: env.NEXT_PUBLIC_SLACK_CLIENT_ID,
      clientSecret: env.NEXT_PUBLIC_SLACK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        ...user,
      },
    }),
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
