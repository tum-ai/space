import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import SlackProvider from "next-auth/providers/slack";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "database/db";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        SlackProvider(
            {
                clientId: process.env.SLACK_CLIENT_ID,
                clientSecret: process.env.SLACK_CLIENT_SECRET,
            }
        ),
    ],
}

const handler = NextAuth(authOptions)

export {handler as GET, handler as POST}