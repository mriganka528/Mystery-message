import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs"
import userModel from "@/models/User";
import connectToDb from "@/lib/dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                await connectToDb();
                try {
                    const user = await userModel.findOne(
                        {
                            $or: [
                                { email: credentials.identifier },
                                { username: credentials.identifier },
                            ]
                        }
                    )
                    if (!user) {
                        throw new Error("No new user found  with this email");
                    }
                    if (!user.isVerified) {
                        throw new Error("Verify your account first");
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return user;
                    }
                    else {
                        throw new Error("Incorrect password");
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            },

        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;

            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;

                session.user.username = token.username;
            }
            return session;
        }
    },
    pages:
    {
        signIn: "/sign-in"
    },
    session:
    {
        strategy: "jwt"
    },
    secret: process.env.SECRET_KEY

} 
