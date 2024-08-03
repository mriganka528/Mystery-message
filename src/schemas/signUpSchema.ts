import { z } from "zod";
export const usernameValidation = z
    .string()
    .min(3, "Username must be at least 2 characters")
    .max(16, "No more than 20 character")
    .regex(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/, "Username must not contain special characters")

export const signUpSchema = z.object(
    {
        username: usernameValidation,
        email: z.string().email({ message: "Invalied email address " }),
        password:z.string().min(6,{message:"password must be at least 6 characters"})
    }
)    