import { z } from 'zod'

export const createRoomSchema = z.object({
  topic: z.string().optional(),
  language: z.string(),
  maxParticipants: z.number(),
})

export const updateRoomMetadataSchema = z.object({
  participantId: z.number(),
})

// `strictObject` throws error if it contains additional
// properties
export const updateRoomSchema = z.strictObject({
  topic: z.string().optional(),
  language: z.string().optional(),
  maxParticipants: z.number().optional(),
})

export type CreateRoom = z.infer<typeof createRoomSchema>
export type UpdateRoom = z.infer<typeof updateRoomSchema>
export type UpdateRoomMetadata = z.infer<typeof updateRoomMetadataSchema>
