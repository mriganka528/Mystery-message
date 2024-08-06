import userModel from "@/models/User";
import { getServerSession } from "next-auth";
import connectToDb from "@/lib/dbConnect";
import { User } from "next-auth";
import { Message } from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(req: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid;
    await connectToDb();
    const session = await getServerSession(authOptions);
    const _user: User = session?.user as User;
    if (!session || !_user) {
        return NextResponse.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }
    try {
        const updateResult = await userModel.updateOne(
            { _id: _user._id },
            { $pull: { messages: { _id: messageId } } }
        );
        if (updateResult.modifiedCount === 0) {
            return NextResponse.json(
                { message: 'Message not found or already deleted', success: false },
                { status: 404 }
            );
        }
        return Response.json(
            { message: 'Message deleted', success: true },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json(
            { message: 'Error deleting message', success: false },
            { status: 500 })
    }
}