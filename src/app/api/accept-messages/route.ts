import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/User";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import { use } from "react";
export async function POST(req: Request) {
    await connectToDb();
    try {
        const session = await getServerSession(authOptions);
        const user: User = session?.user as User;
        if (!session || !session.user) {
            return NextResponse.json({
                success: false,
                message: "Not authenticated"
            }, { status: 401 })
        }
        const userId = user._id;
        const { acceptMesageStatus } = await req.json();
        const updatedUser = await userModel.findByIdAndUpdate(
            userId, {
            isAcceptingMessage: acceptMesageStatus
        },
            {
                new: true,
            }
        )
        if (!updatedUser) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 401 })
        }
        return NextResponse.json({
            success: true,
            message: "User status for accepting message is updated successfully",
            updatedUser
        }, { status: 200 })
    } catch (error) {
        console.log("Failed to update status for accepting message for the user", error);
        return NextResponse.json({
            success: false,
            message: "Error in getting status for accepting message for the user"
        }, { status: 500 })
    }
}

export async function GET(req: Request) {
    await connectToDb();
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({
                success: false,
                message: "Not authenticated"
            }, { status: 401 })
        }
        const user: User = session?.user as User;
        const userId = user._id;
        const foundUser = await userModel.findById(userId);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: "Failed to find the user"
            }, {
                status: 404
            })
        }
        return NextResponse.json({
            success: true,
            acceptingMessageStatus: user.isAcceptingMessages
        }, {
            status: 200
        })
    } catch (error) {
        console.log("Error in getting user status for accepting message", error)
        return NextResponse.json({
            success: false,
            message: "Failed to get the message accepting status"
        }, { status: 500 })
    }
}


