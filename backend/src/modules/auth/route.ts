import express from 'express'
import { callbackHandler, loginHandler, logoutHandler } from '@/modules/auth/handler'
import { isAuthenticated, validateTokensAndSetLocals } from '@/middleware'
import { asyncHandler } from '@/lib/handler'

export const authRouter = express.Router()

authRouter.get('/login', asyncHandler(loginHandler))
authRouter.delete('/logout', [validateTokensAndSetLocals, isAuthenticated], asyncHandler(logoutHandler))
authRouter.get('/:provider/callback', asyncHandler(callbackHandler))
