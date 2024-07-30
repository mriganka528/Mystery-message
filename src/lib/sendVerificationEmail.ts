import { resend } from "./resend";
import VerificationEmail from "@/components/emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verificationCode: string
): Promise<ApiResponse> {

    try {
        await resend.emails.send({
            from: 'Mriganka Sarma <mrigankasarma@resend.dev>',
            to: email,
            subject: 'Mystery Message | verification email',
            react: VerificationEmail({ username, otp: verificationCode }),
        });

        return { success: true, message: "Verification email send successsfully" }

    }
    catch (emailError) {
        console.log("Error sending verification email", emailError)
        return { success: false, message: "Failed to send verification email" }
    }
}