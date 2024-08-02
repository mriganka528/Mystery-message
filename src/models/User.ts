import mongoose, { Document, Schema } from "mongoose";
export interface Message extends Document {
    content: string;
    createdAt: Date
}
const messageScheme: Schema<Message> = new Schema(
    {
        content: {
            type: String,
            requtired: true
        },
        createdAt: {
            type: Date,
            required: true,
            default: Date.now()
        }
    }
)
export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}
const userSchema: Schema<User> = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            unique: true
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            match: [/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/, "Please use a valied email address"],
            unique: true,
        },
        password:
        {
            type: String,
            required: true,
        },
        verifyCode:
        {
            type: String,
            required: [true, "Enter a valied varify code"]
        },
        verifyCodeExpiry: {
            type: Date,
            required: [true, "varify code expiry is required"]
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isAcceptingMessage: {
            type: Boolean,
            default: true
        },
        messages: [messageScheme]
    }
)
const userModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User", userSchema))
export default userModel