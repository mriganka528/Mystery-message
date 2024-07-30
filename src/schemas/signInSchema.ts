import { z } from "zod";
export const signInSchema = z.object({
    idenifier: z.string(),
    password: z.string()
})