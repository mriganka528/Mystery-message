import { ApiResponse } from "@/types/ApiResponse";
const nodemailer = require("nodemailer");
export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string
): Promise<ApiResponse> {
    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.email",
            port: 465,
            secure: true,
            auth: {
                user: process.env.APP_USER,
                pass: process.env.APP_PASSWORD,
            },
        });
        const info = await transporter.sendMail({
            from: {
                name: "Mystic Pulse",
                address: "mrj21012003@gmail.com"
            },
            to: email,
            subject: "Mystic Pulse | verification email",
            html: `
               <h1>Hello ${username},</h1>
               <br>
               <p style="font-size: 1.2rem;">Thank you for registering. Please use the following verification code to complete your registration </p>
               <p style="font-size: 1.2rem; font-weight:bold;">Verification Code : ${verificationCode}</p>
               <p style="font-size: 1.2rem;">If you didn't request this code, please ignore this email.</p>
            ` ,
        });
        console.log("Message sent: %s", info.messageId);
        return { success: true, message: "Verification email send successsfully" }
    }
    catch (emailError) {
        console.log("Error sending verification email", emailError)
        return { success: false, message: "Failed to send verification email" }
    }
}


