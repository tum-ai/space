import NextAuth from "next-auth"
import { authOptions } from "../[...nextauth]";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }