import { db } from "@/db"
import { rooms, NewRoom } from "@/db/schema"
import { AppError, httpStatus } from "@/utils"

export const roomRepo = {
  async create(room: NewRoom) {
    const newRoom = await db.insert(rooms).values(room).returning({
      id: rooms.id
    })
    if(!newRoom.length) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create room")
    }
    return newRoom[0].id
  },

  async getRooms() {
    try {
      return db.query.rooms.findMany()
    } catch(err) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to get rooms")
    }
  },

  async getRoom(roomId: number) {
    try {
     return db.query.rooms.findFirst({
        where: (rooms, { eq }) => eq(rooms.id, roomId) 
      })
    } catch(err) {
      throw new Error(`Failed to get room: ${roomId}`)
    }
  }
}
