import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import SlackProvider from "next-auth/providers/slack";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "database/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcrypt";

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
        const userExists = await prisma.user.findFirst({
          where: {
            id: user.id
          }
        })
        if(!userExists){
          try {
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
                userRoles: { connect: [{ name: "member" }] }
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
        console.log(user)
            console.log("Unable to create user. See Error: \n", Error)
          } 
        }
      });
      return true
    },

    async session({ session, token }) {
      const {firstName, lastName, id, image, roles} = token as any
      session.user = {firstName, lastName, id, image, roles} as any
      console.log(session)
      return session
    },

    async jwt({ token, user }) {
      try{
        if(user){
          const rolesOfUser = await prisma.user.findUnique({
            where: {
              id: user.id,
            },
            select: {
              userRoles: {
                select: {
                  name: true,
                }
              }
            }
          })
          const roles = rolesOfUser.userRoles.map(role => role.name);
          const {firstName, lastName, id, image } = user as any
          return {...token, firstName, lastName, id, image, roles}
        }
      } catch(Error) {
        console.log("Unable to check roles of user. Error: \n", Error)
      }

      return {...token};
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
