import { z } from 'zod'

export const createRoomSchema = z.object({
  topic: z.string().optional(),
  language: z.string(),
  maxParticipants: z.number(),
})

// `strictObject` throws error if it contains additional
// properties
export const updateRoomSchema = z.strictObject({
  topic: z.string().optional(),
  language: z.string().optional(),
  maxParticipants: z.number().optional(),
  metadata: z.strictObject({
    owner: z.number().optional(),
    coOwners: z.array(z.number()).optional(),
    welcomeMessage: z.string().optional()
  }).optional()
})

export const updateRoomSchemaForCoOwner = z.strictObject({
  metadata: z.strictObject({
    welcomeMessage: z.string()
  }).optional()
})

export type CreateRoom = z.infer<typeof createRoomSchema>
export type UpdateRoom = z.infer<typeof updateRoomSchema>
export type UpdateRoomForCoOwner = z.infer<typeof updateRoomSchemaForCoOwner>
