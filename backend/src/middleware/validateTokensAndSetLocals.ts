import { Response, Request, NextFunction  } from 'express'
import { signJWT, verifyJWT } from '@/utils/jwt'
import { sessionRepo } from '@/session/repo'
import { createCookie } from '@/utils/cookie'
import ms from 'ms'
import { config } from '..'

export async function validateTokensAndSetLocals(req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken }  = req.cookies

  if(accessToken) {
    const decodedToken = verifyJWT<{ userId: string, sessionId: number }>(accessToken)
    if(decodedToken.userId) {
      res.locals.userId = decodedToken.userId
      res.locals.sessionId = decodedToken.sessionId
      return next()
    }
  }

  if(!refreshToken) {
    return next()
  }

  const { sessionId } = verifyJWT<{ sessionId?: string }>(refreshToken)
  if(!sessionId) {
    return next()
  }

  try {
    const session = await sessionRepo.get(parseInt(sessionId))
    if(session) {
      const token = signJWT({ userId: session.userId, sessionId: session.id }, config.jwt.accessTokenExpiry)
      res.cookie("accessToken", token, createCookie(ms(config.jwt.accessTokenExpiry))) 
      res.locals.userId = session.userId
      res.locals.sessionId = session.id
      next()
    }
  } catch(err) {
    console.error("error: validateTokensAndSetLocals:", err)
  }

  next()
}
