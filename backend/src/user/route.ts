import express from 'express'
import { asyncHandler } from '@/utils'
import { meHandler } from '@/user/handler'
import { isAuthenticated, validateTokensAndSetLocals } from '@/middleware'

export const userRouter = express.Router()
userRouter.get('/me', validateTokensAndSetLocals, isAuthenticated, asyncHandler(meHandler))
