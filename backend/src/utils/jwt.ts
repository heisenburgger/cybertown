import jwt from 'jsonwebtoken'
import { config } from '..'
import { AppError } from './error'
import { httpStatus } from './httpStatus'

export function signJWT(payload: Record<string, any>, expiresIn: string) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn
  })
}

// TODO: what the fuck this returns?
export function verifyJWT<T>(token: string): T {
  try {
    return jwt.verify(token, config.jwt.secret) as T
  } catch(err) {
    // probably need to check the type of error
    throw new AppError(httpStatus.UNAUTHORIZED, "Expired token")
  }
}
