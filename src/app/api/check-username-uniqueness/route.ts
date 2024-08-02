import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { NextResponse } from "next/server";
import { url } from "inspector";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})
export async function GET(request: Request) {
    await connectToDb();
    try {
        const { searchParams } = new URL(request.url);
        const queryParams = {
            username: searchParams.get('username')
        }
        //validate with ZOD
        const result = UsernameQuerySchema.safeParse(queryParams);
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return NextResponse.json({
                success: false,
                message: usernameErrors
            }, {
                status: 400
            })


        }
        const { username } = result.data
        const existingVerifiedUser = await userModel.findOne({
            username, isVerified: true
        }
        )
        if (existingVerifiedUser) {
            return NextResponse.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }
        return NextResponse.json({
            success: true,
            message: "Username is available"
        }, { status: 400 })
    } catch (error) {
        console.log("Error checking username", error);
        return NextResponse.json({
            success: false,
            message: "Error checking username"
        },
            {
                status: 500
            })
    }
}
