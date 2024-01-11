import { db } from "@/db"
import { rooms, users } from "@/db/schema"
import { httpStatus } from "@/lib/utils"
import { NewRoom, Room } from '@/types/entity'
import { AppError } from "@/lib/AppError"
import { eq } from "drizzle-orm"

export const roomRepo = {
  async create(room: NewRoom) {
    try {
      const newRoom = await db.insert(rooms).values(room).returning()
      if (!newRoom.length) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create room")
      }
      return newRoom[0]
    } catch(err) {
      throw err
    }
  },

  async getRooms() {
    try {
      return db.select({
        id: rooms.id,
        topic: rooms.topic,
        language: rooms.language,
        maxParticipants: rooms.maxParticipants,
        metadata: rooms.metadata,
        createdAt: rooms.createdAt,
        createdBy: {
          id: users.id,
          username: users.username,
          avatar: users.avatar,
        }
      }).from(rooms).leftJoin(users, eq(rooms.createdBy, users.id))
    } catch (err) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get rooms")
    }
  },

  async getRoom(roomId: number) {
    try {
      return db.query.rooms.findFirst({
        where: (rooms, { eq }) => eq(rooms.id, roomId)
      })
    } catch (err) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to get room: ${roomId}`)
    }
  },

  async updateRoom(room: Room, roomId: number) {
    try {
      const result = await db.update(rooms).set(room).where(eq(rooms.id, roomId)).returning()
      return result[0]
    } catch (err) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Failed to update room: ${roomId}`)
    }
  },
}
