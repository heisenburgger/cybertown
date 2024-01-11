import { Response, Request, NextFunction  } from 'express'
import { signJWT, verifyJWT } from '@/utils/jwt'
import { sessionRepo } from '@/session/repo'
import { cookieOptions } from '@/utils/cookie'
import ms from 'ms'
import { config } from '..'

type JWTPayload = {
  userId: number
  sessionId: number
}

export async function validateTokensAndSetLocals(req: Request, res: Response, next: NextFunction) {
  const { accessToken, refreshToken }  = req.cookies

  // if the accessToken is valid, set the locals and pass
  // the control to the next handler in middleware chain
  const accessTokenPayload = verifyJWT<JWTPayload>(accessToken)
  if(accessTokenPayload) {
    res.locals.userId = accessTokenPayload.userId
    res.locals.sessionId = accessTokenPayload.sessionId
    return next()
  }

  // if the refreshToken is not valid, move to the next middleware
  const refreshTokenPayload = verifyJWT<JWTPayload>(refreshToken)
  const sessionId = refreshTokenPayload?.sessionId
  if(!sessionId) {
    return next()
  }

  // if valid, verify the session ID
  try {
    const session = await sessionRepo.get(sessionId)
    if(session) {
      const payload = {
        userId: session.userId, 
        sessionId: session.id 
      }
      const token = signJWT(payload, config.jwt.accessTokenExpiry)
      res.cookie("accessToken", token, cookieOptions(ms(config.jwt.accessTokenExpiry))) 
      res.locals.userId = session.userId
      res.locals.sessionId = session.id
    }
  } catch(err) {
    console.error("error: validateTokensAndSetLocals:", err)
  }

  next()
}
