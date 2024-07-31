import nextAuth from "next-auth";
import { authOptions } from "./options";
import NextAuth from "next-auth/next";
const handler = NextAuth(authOptions);
export { handler as GetAnimationsOptions, handler as POST }