import express from 'express'
import { callbackHandler, loginHandler, logoutHandler } from '@/modules/auth/handler'
import { isAuthenticated, setLocals } from '@/middleware'
import { asyncHandler } from '@/lib/handler'

export const authRouter = express.Router()

authRouter.get('/login', asyncHandler(loginHandler))
authRouter.delete('/logout', [setLocals, isAuthenticated], asyncHandler(logoutHandler))
authRouter.get('/:provider/callback', asyncHandler(callbackHandler))
