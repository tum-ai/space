import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import SlackProvider from "next-auth/providers/slack";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "database/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";
import { jwt, signIn, createNewSession, signInCred } from "./signIn";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth",
  },
  providers: [
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
    }),
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
        if (process.env.NEXT_PUBLIC_VERCEL_ENV != "development") {
          return null;
        }

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: credentials?.email },
          include: {
            userToUserRoles: {
              select: {
                role: {
                  select: {
                    name: true,
                    userPermissions: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
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
          id: `${existingUser.id}`,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          // TODO: add roles and permissions to the user object, jwt and session.
          // Best practice is to modify the type -> includes the roles and permissions
          // roles: existingUser.userToUserRoles.map((role) => role.role.name),
          // permissions: existingUser.userToUserRoles
          //   .map((role) => role.role.userPermissions)
          //   .flat(),
          image: existingUser.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ credentials, profile, account }) {
      if (account.provider === "slack") {
        return signIn({ profile, account });
      } else {
        return signInCred({ credentials, account });
      }
    },

    async session({ session, token }) {
      return createNewSession({ session, token });
    },

    async jwt({ token, user }) {
      return jwt({ token, user });
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
