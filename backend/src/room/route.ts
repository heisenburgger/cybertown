import { isAuthenticated, validateBody, validateTokensAndSetLocals } from '@/middleware'
import express from 'express'
import { roomSchema } from './validation'
import { asyncHandler } from '@/utils'
import { createRoomHandler, getRoomsHandler } from './handler'

export const roomRouter = express.Router()

// POST /v1/rooms
roomRouter.post('/', validateTokensAndSetLocals, isAuthenticated, validateBody(roomSchema), asyncHandler(createRoomHandler))
roomRouter.get('/', asyncHandler(getRoomsHandler))
