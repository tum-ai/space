import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import db from "../../../database/db";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // can change to session if we want to save information in database (cost of performance)
  },
  pages: {
    signIn: "/auth",
    newUser: "/auth/signup",
    /*
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/verify-request', // (used for check email message)
        */
    //TODO: add signOut, error pages
  },
  providers: [
    //TODO: add email provider setup
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "max.mustermann@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await db.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!existingUser) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.password,
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: `${existingUser.user_id}`,
          username: existingUser.first_name + "_" + existingUser.last_name, //do we really need this here?
          email: existingUser.email,
        };
      },
    }),
    // EmailProvider({
    //     server: process.env.EMAIL_SERVER,
    //     from: process.env.EMAIL_FROM
    // }),
  ],
  callbacks: {
    //TODO: add more callbacks, setup proper session management
    async jwt({ token, user }) {
      console.log(token, user);

      if (user) {
        return {
          ...token,
          username: user.username,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
        },
      };
    },
  },
};
