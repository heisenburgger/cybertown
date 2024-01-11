import jwt from 'jsonwebtoken'
import { config } from '..'

export function signJWT(payload: Record<string, any>, expiresIn: string) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn
  })
}

export function verifyJWT<T>(token: string): T | null {
  try {
    return jwt.verify(token, config.jwt.secret) as T
  } catch(err) {
    return null
  }
}
