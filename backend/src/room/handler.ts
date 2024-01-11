import { Response, Request, NextFunction } from 'express'
import { RoomSchema } from './validation'
import { roomRepo } from './repo'
import { io } from '..'
import { Room, User } from '@/db/schema'

type SocketRoom = Room & {
  participants: User[]
}

export async function createRoomHandler(req: Request, res: Response, _next: NextFunction) {
  const userId = res.locals.userId
  const room = req.body as RoomSchema
  const roomId =  await roomRepo.create({
    maxParticipants: room.maxParticipants,
    topic: room.topic,
    language: room.language,
    createdBy: userId,
    metadata: room.metadata,
  })
  res.send({
    roomId
  })
}

export async function getRoomsHandler(_req: Request, res: Response, _next: NextFunction) {
  const rooms = await roomRepo.getRooms() as SocketRoom[]
  for(let room of rooms) {
    room.participants = []
    const participantSockets = await io.in(room.id.toString()).fetchSockets()
    participantSockets.forEach(socket => {
      if(socket.data.user) {
        room.participants.push(socket.data.user)
      } else {
        console.log("warn: missing user for socket:", socket.id)
      }
    })
  }
  res.send({
    rooms
  })
}
