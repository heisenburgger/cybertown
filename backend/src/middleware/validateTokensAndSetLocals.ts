import { Response, Request, NextFunction  } from 'express'
import { signJWT, verifyJWT } from '@/utils/jwt'
import { sessionRepo } from '@/session/repo'
import { createCookie } from '@/utils/cookie'
import ms from 'ms'
import { config } from '..'

export async function validateTokensAndSetLocals(req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken }  = req.cookies

  if(accessToken) {
    try {
      const accessTokenPayload = verifyJWT<{ userId: string, sessionId: number }>(accessToken)
      if(accessTokenPayload.userId) {
        res.locals.userId = accessTokenPayload.userId
        res.locals.sessionId = accessTokenPayload.sessionId
        return next()
      }
    } catch(err) {
      return next()
    }
  }

  if(!refreshToken) {
    return next()
  }

  let sessionId;
  try {
    const refreshTokenPayload = verifyJWT<{ sessionId?: string }>(refreshToken)
    sessionId = refreshTokenPayload.sessionId
    if(!sessionId) {
      return next()
    }
  } catch(err) {
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
