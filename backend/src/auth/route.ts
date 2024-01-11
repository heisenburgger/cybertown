import express from 'express'
import { callbackHandler, loginHandler, logoutHandler } from '@/auth'
import { isAuthenticated, validateTokensAndSetLocals } from '@/middleware'
import { asyncHandler } from '@/utils'

export const authRouter = express.Router()

authRouter.get('/login', asyncHandler(loginHandler))
authRouter.delete('/logout', validateTokensAndSetLocals, isAuthenticated, asyncHandler(logoutHandler))
authRouter.get('/:provider/callback', asyncHandler(callbackHandler))
