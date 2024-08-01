import connectToDb from "@/lib/dbConnect";
import userModel from "@/models/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";

export async function POST(request: Request) {
    await connectToDb();
    try {
        const { username, email, password } = await request.json();
        const existingUserVerifiedByUsername = await userModel.findOne(
            {
                username,
                isVerified: true
            }
        )
        if (existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "Username is alrady taken"
                },
                {
                    status: 400
                }
            )
        }
        const existingUserByEmail = await userModel.findOne(
            {
                email
            }
        )
        const verifyCode = Math.floor(10000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, {
                    status: 400
                })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                const expiryDate = new Date();
                expiryDate.setHours(expiryDate.getHours() + 1);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCodeExpiry = expiryDate;
                existingUserByEmail.verifyCode = verifyCode;
                await existingUserByEmail.save();
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new userModel(
                {
                    username,
                    email,
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    message: []
                }
            )
            await newUser.save();
        }
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        return Response.json({
            message: "User created successfully",
            success: true,
            emailResponse
        })
    } catch (error) {
        console.log("Error registering user ", error)
        return Response.json({
            success: false,
            message: "Error registering user"
        },
            {
                status: 500
            }
        )
    }

}