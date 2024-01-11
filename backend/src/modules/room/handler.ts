import { Response, Request, NextFunction } from 'express'
import { CreateRoom } from '@/modules/room/validation'
import { roomRepo } from '@/modules/room/repo'
import { SocketRoom } from '@/types/entity'
import { io } from '@/index'
import { httpStatus, prefixedRoomId } from '@/lib/utils'
import { AppError } from '@/lib/AppError'
import { roomService } from '@/modules/room/service'

export async function createRoomHandler(req: Request, res: Response, _next: NextFunction) {
  const userId = res.locals.userId
  const room = req.body as CreateRoom
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

export async function updateRoomHandler(req: Request, res: Response, _next: NextFunction) {
  const userId = res.locals.userId
  const roomId = parseInt(req.params.roomId)
  let room = await roomRepo.getRoom(roomId)
  if(!room) {
    throw new AppError(httpStatus.BAD_REQUEST, "The requested room is not found")
  }
  const roomRole = roomService.getRoomRole(userId, room)
  if(roomRole === 'guest') {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized")
  }
  const updateRoomPayload = roomService.getUpdateRoomPayload(roomRole, room, req.body)
  const updatedRoom = await roomRepo.updateRoom(updateRoomPayload, roomId)
  io.emit('room:updated', updatedRoom)
  res.send({ room: updatedRoom })
}
