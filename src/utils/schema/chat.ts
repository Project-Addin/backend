import { z } from "zod";

export const createRoomPersonalSchema = z.object({
    user_id: z.string()
}).strict()

export const createMessageSchema = z.object({
    message: z.string(),
    room_id: z.string()
})

export type CreateRoomPersonalValues = z.infer<typeof createRoomPersonalSchema>
export type CreateMessageValues = z.infer<typeof createMessageSchema>