import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import SlackProvider from "next-auth/providers/slack";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "database/db";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { compare } from "bcrypt";
import Error from "next/error";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30 days
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth"
  },
  providers: [
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      async profile(profile) {
        return {
          id: profile["https://slack.com/user_id"] || profile.sub,
          email: profile.email
        };
      },
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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({
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
          id: `${existingUser.id}`,
          username: existingUser.firstName + "_" + existingUser.lastName,
          email: existingUser.email,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile, account }: {user, profile, account}) {
      await prisma.$transaction(async (prisma) => {    
        try {
          const role = await prisma.userRole.upsert({
            where: { name: "member" },
            update: {},
            create: { name: "member" }
          });

          const {email,given_name: firstName,family_name: lastName,picture: image, date_email_verified: emailVerifiedTimestamp} = profile;
    
          const persistedUser = await prisma.user.create({
            data: {
              email,
              firstName,
              lastName,
              image,
              emailVerified: new Date(emailVerifiedTimestamp * 1000),
              createdAt: new Date(),
              updatedAt: new Date(),
              userRoles: { connect: [{ name: role.name }] }
            }
          });

          const {id_token:idToken, type, provider, providerAccountId, ok, state, access_token:accessToken, token_type:tokenType} = account
    
          await prisma.account.create({
            data: {
              userId: persistedUser.id,
              idToken,
              type,
              provider,
              providerAccountId,
              ok,
              state,
              accessToken,
              tokenType,
              createdAt: new Date(),
              updatedAt: new Date()
            }
          });
        } catch (Error) {
          console.log("\n\n\n\n\n")
        }
      });
      return true
    },
    async jwt({ token, user }) {
      
      console.log({...token, ...user})

      if (user) {
        return {...token, ...user}
      }
      return token;
    },
    async session({ session, token }) {
      //TODO print this out
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          firstName: token.firstName,
          lastName: token.lastName,
          image: token.image
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
