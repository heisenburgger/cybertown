import { Request, Response } from "express";
import { authService } from "@/auth";
import { sessionRepo } from "@/session";
import { userRepo } from "@/user";
import { createCookie } from '@/utils'
import ms from 'ms'
import { config } from "..";

export function loginHandler(_req: Request, res: Response) {
  const url = authService.getRedirectURL()
  return res.redirect(url)
}

export async function logoutHandler(_req: Request, res: Response) {
  // TODO: can we improve this?
  await sessionRepo.delete(res.locals.sessionId!, res.locals.userId!)
  res.cookie("accessToken", "", createCookie(0))
  res.cookie("refreshToken", "", createCookie(0))
  // TODO: custom response format
  return res.send({ message: "Logged out" })
}

export async function callbackHandler(req: Request, res: Response) {
  // TODO: validate the incoming data (in middleware?)
  const code = req.query.code as string
  const user = await authService.getUserFromAuthProvider(code)
  await userRepo.upsert(user)
  const sessionId = await sessionRepo.create({
    userId: user.id,
  })

  const [accessToken, refreshToken] = authService.createTokens(user.id, sessionId)
  const accessTokenExpiry = ms(config.jwt.accessTokenExpiry)
  const refreshTokenExpiry = ms(config.jwt.refreshTokenExpiry)

  res.cookie("accessToken", accessToken, createCookie(accessTokenExpiry))
  res.cookie("refreshToken", refreshToken, createCookie(refreshTokenExpiry))
  return res.redirect(config.domain)
}

