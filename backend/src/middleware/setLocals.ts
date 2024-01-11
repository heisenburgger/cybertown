import { Response, Request, NextFunction  } from 'express'
import { signJWT } from '@/lib/jwt'
import { cookieOptions } from '@/lib/utils'
import ms from 'ms'
import { config } from '..'
import { validateTokens } from '@/lib/validateTokens'

export async function setLocals(req: Request, res: Response, next: NextFunction) {
  const payload = await validateTokens(req.cookies)
  if(!payload) {
    return next()
  }
  const token = signJWT(payload, config.jwt.accessTokenExpiry)
  res.cookie("accessToken", token, cookieOptions(ms(config.jwt.accessTokenExpiry))) 
  res.locals.userId = payload.userId
  res.locals.sessionId = payload.sessionId
  next()
}
