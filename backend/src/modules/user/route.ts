import express from 'express'
import { asyncHandler } from '@/lib/handler'
import { meHandler } from '@/modules/user/handler'
import { isAuthenticated, setLocals } from '@/middleware'

export const userRouter = express.Router()
userRouter.get('/me', [setLocals, isAuthenticated], asyncHandler(meHandler))
