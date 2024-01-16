import { Response, Request, NextFunction } from 'express'
import { CreateRoom, UpdateRoom, UpdateRoomMetadata } from '@/modules/room/validation'
import { roomRepo } from '@/modules/room/repo'
import { SocketRoom } from '@/types/entity'
import { io } from '@/index'
import { httpStatus, prefixedRoomId } from '@/lib/utils'
import { AppError } from '@/lib/AppError'
import { roomService } from '@/modules/room/service'
import { userRepo } from '../user/repo'

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
  const body = req.body as UpdateRoom
  let room = await roomRepo.getRoom(roomId)
  if(!room) {
    throw new AppError(httpStatus.BAD_REQUEST, "The requested room is not found")
  }
  const roomRole = roomService.getRoomRole(userId, room)
  if(roomRole === 'guest') {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized")
  }
  const updateRoomPayload = {
    ...room,
    ...body,
  }
  const updatedRoom = await roomRepo.updateRoom(updateRoomPayload, roomId)
  io.emit('room:updated', updatedRoom)
  res.send({ room: updatedRoom })
}

// parse "req.body", "req.params", "req.query" in validateMiddleware
export async function updateRoomMetadataHandler(req: Request, res: Response, _next: NextFunction) {
  const userId = res.locals.userId
  const body = req.body as UpdateRoomMetadata

  // check if the room is valid
  const roomId = parseInt(req.params.roomId)
  const room = await roomRepo.getRoom(roomId)
  if(!room) {
    throw new AppError(httpStatus.BAD_REQUEST, "The room is not found")
  }

  // check if the user has permission
  const roomRole = roomService.getRoomRole(userId, room)
  if(roomRole === 'guest') {
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized")
  }

  // check if participants involved are valid
  const participants = await userRepo.getUserProfiles([body.participantId, userId])
  const isParticipantsValid = body.participantId === userId ? participants.length === 1 : participants.length === 2
  if(!isParticipantsValid) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid participants")
  }

  // check if the user and the participant is part of room
  const socketRoomId = prefixedRoomId(roomId)
  let sockets = await io.in(socketRoomId).fetchSockets()
  sockets = sockets.filter(socket => {
    const socketUserId = socket.data.auth?.userId 
    return socketUserId === userId || socketUserId === body.participantId
  })
  const isParticipantsInRoom = body.participantId === userId ? sockets.length === 1 : sockets.length === 2
  if(!isParticipantsInRoom) {
    throw new AppError(httpStatus.BAD_REQUEST, "The participant or user is not in room")
  }

  const user = participants.find(participant => participant.id === userId)
  const participant = participants.find(participant => participant.id === body.participantId)

  // ?coOwner={0,1} [0 - removes, 1 - adds]
  if("coOwner" in req.query) {
    const event = roomService.setCoOwnership({
      user: user!,
      participant: participant!,
      op: req.query.coOwner as '0' | '1',
      room,
    })
    if(event) {
      await roomRepo.updateRoom(room, roomId)
      io.in(socketRoomId).emit('room:coOwnership:updated', event)
      return res.send({
        event
      })
    }
  }

  if(typeof req.query.welcomeMessage === 'string') {
    const event = roomService.updateWelcomeMessage({
      welcomeMessage: req.query.welcomeMessage,
      participant: participant!,
      room,
    })
    await roomRepo.updateRoom(room, roomId)
    io.in(socketRoomId).emit('room:welcomeMessage:updated', event)
    return res.send({
      event
    })
  }

  res.status(httpStatus.BAD_REQUEST).send({
    error: "Bad request"
  })
}
