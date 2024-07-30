import { z } from "zod"
export const messageSchema = z.object({
    content: z
        .string()
        .min(10, { message: "Content must at leasr of 10 charcters" })
        .max(300, { message: "Content must be no longer than 300 characters" })
})