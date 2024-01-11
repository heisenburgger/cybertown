import express from 'express'
import { asyncHandler } from '@/lib/handler'
import { meHandler } from '@/modules/user/handler'
import { isAuthenticated, validateTokensAndSetLocals } from '@/middleware'

export const userRouter = express.Router()
userRouter.get('/me', [validateTokensAndSetLocals, isAuthenticated], asyncHandler(meHandler))
