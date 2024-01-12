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
    async signIn({ user, profile: pro, account: acc }: {user, profile, account}) {
      // Start a transaction
      await prisma.$transaction(async (prisma) => {
        const userExists = await prisma.user.findFirst({
          where: { 
            accounts: {
              some: {
                id: user.id 
              }
            },
        }})

        console.log(userExists)

        console.log("Here;s the user",user)

        //TODO ensure that you check the role!

        if (!userExists) {
          try{
            const userPersi = await prisma.user.create({
              data: {
                email: pro.email,
                firstName: pro.given_name,
                lastName: pro.family_name,
                image: pro.picture,
                emailVerified: new Date(pro.date_email_verified*1000),
                createdAt: new Date(),
                updatedAt: new Date(),
                userRoles: {connect: [{name: "member"}]}
              }
            })

            const toke = acc.access_token
            console.log(toke)

            await prisma.account.create({
              data: {
                userId: userPersi.id,
                idToken: acc.id_token,
                type: acc.type,
                provider: acc.provider,
                providerAccountId: acc.providerAccountId,
                ok: acc.ok,
                state: acc.state,
                accessToken: toke,
                tokenType: acc.token_type,
                createdAt: new Date(acc.createdAt),
                updatedAt: new Date(acc.updatedAt)
              }
            })
          }
          catch(Error){

            console.log("\n\n\n\n\n",Error)
          }

          //TODO destructure hwere possible
          }
          return userExists;
        });

      return true; 
    },
    async jwt({ token, user }) {
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
