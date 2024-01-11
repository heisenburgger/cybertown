import { Response, Request, NextFunction } from 'express'
import { RoomSchema } from './validation'
import { roomRepo } from './repo'

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
