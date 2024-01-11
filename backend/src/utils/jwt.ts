import jwt from 'jsonwebtoken'
import { config } from '..'

export function signJWT(payload: Record<string, any>, expiresIn: string) {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn
  })
}

// TODO: what the fuck this returns?
export function verifyJWT<T>(token: string): T {
  return jwt.verify(token, config.jwt.secret) as T
}
