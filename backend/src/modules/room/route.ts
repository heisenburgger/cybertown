import express from 'express'
import { createRoomSchema } from '@/modules/room/validation'
import { asyncHandler } from '@/lib/handler'
import { createRoomHandler, getRoomsHandler } from '@/modules/room/handler'
import { validateBody, isAuthenticated, setLocals } from '@/middleware'

export const roomRouter = express.Router()

roomRouter.post('/', [setLocals, isAuthenticated, validateBody(createRoomSchema)], asyncHandler(createRoomHandler))
roomRouter.get('/', asyncHandler(getRoomsHandler))