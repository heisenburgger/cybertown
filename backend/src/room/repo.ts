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
  }
}
