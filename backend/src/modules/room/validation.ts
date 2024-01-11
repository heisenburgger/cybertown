import { z } from 'zod'

export const createRoomSchema = z.object({
  topic: z.string().optional(),
  language: z.string(),
  maxParticipants: z.number(),
})

export type CreateRoomSchema = z.infer<typeof createRoomSchema>
