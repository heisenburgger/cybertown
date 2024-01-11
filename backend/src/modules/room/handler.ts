import { Response, Request, NextFunction } from 'express'
import { CreateRoomSchema } from '@/modules/room/validation'
import { roomRepo } from '@/modules/room/repo'
import { SocketRoom } from '@/types/entity'
import { io } from '@/index'
import { prefixedRoomId } from '@/lib/utils'

export async function createRoomHandler(req: Request, res: Response, _next: NextFunction) {
  const userId = res.locals.userId
  const room = req.body as CreateRoomSchema
  const newRoom =  await roomRepo.create({
    maxParticipants: room.maxParticipants,
    topic: room.topic,
    language: room.language,
    createdBy: userId,
    metadata: {
      owner: userId,
    },
  })
  io.emit('room:created', newRoom)
  res.send({
    room: newRoom
  })
}

export async function getRoomsHandler(_req: Request, res: Response, _next: NextFunction) {
  const rooms = await roomRepo.getRooms() as SocketRoom[]
  for(let room of rooms) {
    room.participants = []
    const socketRoomId = prefixedRoomId(room.id)
    const participantSockets = await io.in(socketRoomId).fetchSockets()
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
