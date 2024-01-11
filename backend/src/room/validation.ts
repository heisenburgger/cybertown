import { z } from 'zod'

const metadataSchema = z.object({
  owner: z.string(),
  coOwners: z.array(z.string()),
  welcomeMessage: z.string().optional(),
})

export const roomSchema = z.object({
  topic: z.string().optional(),
  language: z.string(),
  maxParticipants: z.number(),
  metadata: metadataSchema,
})

export type RoomSchema = z.infer<typeof roomSchema>
