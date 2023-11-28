import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import SlackProvider from "next-auth/providers/slack";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "database/db";

export const authOptions: NextAuthOptions = {
    session:{
        strategy:"jwt",
    },
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth',
    },
    providers: [
        SlackProvider(
            {
                clientId: process.env.SLACK_CLIENT_ID,
                clientSecret: process.env.SLACK_CLIENT_SECRET,
                profile(profile, tokens) {
                    return {
                        id: profile["https://slack.com/user_id"] || profile.sub,
                        email: profile.email,
                        image: profile.picture,
                        first_name: profile.given_name,
                        permission: 'member',
                        last_name: profile.family_name,
                        emailVerified: profile.date_email_verified
                    };
                },
            },
        ),
    ],
    callbacks:{
        async jwt({token,user}){
            return{...token,...user}
        },
        async session({session,token}){
            session.user.id = token.id
            session.user.first_name = token.first_name
            session.user.permission = token.permission
            session.user.image = token.image
            return session
        }
    }
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}