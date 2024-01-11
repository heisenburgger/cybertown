import { Request, Response } from "express";
import { authService } from "@/auth";
import { sessionRepo } from "@/session";
import { createCookie, AppError, httpStatus } from '@/utils'
import ms from 'ms'
import { config } from "..";
import { userService } from "@/user/service";
import { authRepo } from "./repo";
import { NewAuthProvider } from "@/db/schema";
import { callbackParamsSchema } from "./validation";

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
  const parsedParams = callbackParamsSchema.safeParse(req.params)
  if(!parsedParams.success) {
    throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, "The provider is unsupported")
  }
  const provider = parsedParams.data.provider
  const code = req.query.code as string
  const user = await authService.getUserFromAuthProvider(code)
  let userId = await authRepo.getUserIDForKey(user.key, provider)

  if(userId) {
    await userService.updateUser({
      avatar: user.avatar,
      username: user.username,
      userId,
    })
  } else {
    userId = await userService.createUser({
      ...user,
      provider,
    })
  }

  const sessionId = await sessionRepo.create({
    userId
  })

  const [accessToken, refreshToken] = authService.createTokens(userId, sessionId)
  const accessTokenExpiry = ms(config.jwt.accessTokenExpiry)
  const refreshTokenExpiry = ms(config.jwt.refreshTokenExpiry)

  res.cookie("accessToken", accessToken, createCookie(accessTokenExpiry))
  res.cookie("refreshToken", refreshToken, createCookie(refreshTokenExpiry))
  return res.redirect(config.webRedirectURL)
}

