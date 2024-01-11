import { Room } from '@/types/entity'
import { UpdateRoom, UpdateRoomForCoOwner, updateRoomSchema, updateRoomSchemaForCoOwner } from '@/modules/room/validation'
import { AppError } from '@/lib/AppError'
import { httpStatus } from '@/lib/utils'
import { ZodObject } from 'zod'

export type RoomRole = 'owner' | 'co-owner' | 'guest'

export const roomService = {
  getRoomRole(userId: number, room: Room) {
    let roomRole: RoomRole = 'guest'
    if(room.metadata.owner === userId) {
      roomRole = 'owner'
    }
    if(room.metadata.coOwners?.includes(userId)) {
      roomRole = 'co-owner'
    }
    return roomRole
  },

  // parses the req.body based on the computed room role
  getUpdateRoomPayload(role: Exclude<RoomRole, 'guest'>, room: Room, payload: Record<string, any>) {
    let schema: ZodObject<any, any, any> | null = null
    if(role === 'owner') {
      schema = updateRoomSchema
    }
    if(role === 'co-owner') {
      schema = updateRoomSchemaForCoOwner
    }
    const parsedPayload = schema?.safeParse(payload)
    if(!parsedPayload?.success) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, "Invalid body")
    }
    const roomPayload = parsedPayload.data as UpdateRoomForCoOwner | UpdateRoom
    return {
      ...room,
      ...roomPayload,
      metadata: {
        ...room.metadata,
        ...roomPayload.metadata
      },
    }
  }
}
