import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/User";
import { date, z } from 'zod'
import { verifySchema } from "@/schemas/verifySchema";
import { NextResponse } from "next/server";

const verifyCodeSchema = z.object({
    code: verifySchema.shape.code
})

export async function POST(req: Request) {
    await connectToDb();
    try {
        const { username, code } = await req.json()
        const result = verifyCodeSchema.safeParse({ code })
        if (!result.success) {
            const verifyCodeErrors = result.error.format()?._errors || []
            return NextResponse.json({
                success: false,
                message: verifyCodeErrors
            }, { status: 400 })
        }
        const decodedUsername = await decodeURIComponent(username)
        const user = await userModel.findOne({
            username: decodedUsername
        })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found",
            }, { status: 500 })
        }
        const isverifyCodevalied = user.verifyCode === code;
        const isVerifyCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if (isverifyCodevalied && isVerifyCodeNotExpired) {
            user.isVerified = true;
            await user.save();
            return NextResponse.json({
                success: true,
                message: "User verified successfully"
            }, { status: 200 })
        } else if (!isVerifyCodeNotExpired) {
            return NextResponse.json({
                success: false,
                message: "Verify code expired, please sign in again to verify your account"
            }, { status: 400 });
        } else {
            return NextResponse.json({
                success: false,
                message: "Incorrect verify code, check your verify code again"
            }, { status: 400 })
        }

    } catch (error) {
        console.log("Error verifying the user", error)
        return NextResponse.json({
            success: false,
            message: "Error verifying the user"
        }, { status: 500 })
    }
}