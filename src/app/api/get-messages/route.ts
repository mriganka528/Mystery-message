import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/User";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
export async function GET(req: Request) {
    try {
        await connectToDb();
        const session = await getServerSession(authOptions);
        const user = session?.user as User
        if (!session || session.user) {
            return NextResponse.json({
                success: false,
                message: "Not authenticated"
            }, { status: 401 })
        }
        const userId = new mongoose.Types.ObjectId(user._id);
        const findUser = await userModel.aggregate([
            { $match: { id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        if (!findUser || findUser.length === 0) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 401 })
        }
        return NextResponse.json({
            success: true,
            messages: findUser[0].messages
        }, { status: 200 })
    } catch (error) {
        console.log("An unexpected error occured :", error)
        return NextResponse.json({
            success: false,
            message: "Failed to fetch all messages of the user"
        }, { status: 500 })
    }
}