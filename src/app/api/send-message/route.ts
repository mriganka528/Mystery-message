import userModel from "@/models/User";
import connectToDb from "@/lib/dbConnect";
import { Message } from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        await connectToDb();
        const { username, content } = await req.json()
        const user = await userModel.findOne({ username })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }

        //checking if user is accepting message
        if (!user.isAcceptingMessage) {
            return NextResponse.json({
                success: false,
                message: "User is not accepting messages"
            }, { status: 403 })
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message)
        await user.save();
        return NextResponse.json({
            success: true,
            message: "Message sent successfully"
        }, { status: 200 })
    } catch (error) {
        console.log("Error sending messages :", error)
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        }, { status: 500 })
    }

}