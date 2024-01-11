import express from 'express'
import { createRoomSchema, updateRoomMetadataSchema, updateRoomSchema } from '@/modules/room/validation'
import { asyncHandler } from '@/lib/handler'
import { createRoomHandler, getRoomsHandler, updateRoomHandler, updateRoomMetadataHandler } from '@/modules/room/handler'
import { validateBody, isAuthenticated, setLocals } from '@/middleware'

export const roomRouter = express.Router()

roomRouter.post('/', [setLocals, isAuthenticated, validateBody(createRoomSchema)], asyncHandler(createRoomHandler))
roomRouter.get('/', asyncHandler(getRoomsHandler))
roomRouter.put('/:roomId', [setLocals, isAuthenticated, validateBody(updateRoomSchema)], asyncHandler(updateRoomHandler))
roomRouter.put('/:roomId/metadata', [setLocals, isAuthenticated, validateBody(updateRoomMetadataSchema)], asyncHandler(updateRoomMetadataHandler))
