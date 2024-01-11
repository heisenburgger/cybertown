import { Request, Response } from "express";
import { authService } from "@/modules/auth/service";
import { sessionRepo } from "@/modules/session/repo";
import { cookieOptions, httpStatus } from '@/lib/utils'
import ms from 'ms'
import { config } from "@/index";
import { userService } from "@/modules/user/service";
import { authRepo } from "./repo";
import { callbackParamsSchema } from "./validation";
import { userRepo } from "@/modules/user/repo";
import { AppError } from "@/lib/AppError";

export function loginHandler(_req: Request, res: Response) {
  const url = authService.getRedirectURL()
  return res.redirect(url)
}

export async function logoutHandler(_req: Request, res: Response) {
  await sessionRepo.delete(res.locals.sessionId, res.locals.userId)
  res.cookie("accessToken", "", cookieOptions(0))
  res.cookie("refreshToken", "", cookieOptions(0))
  return res.send({ message: "Logged out" })
}

export async function callbackHandler(req: Request, res: Response) {
  const parsedParams = callbackParamsSchema.safeParse(req.params)
  if(!parsedParams.success) {
    throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, "The provider is not supported")
  }
  const provider = parsedParams.data.provider
  const code = req.query.code as string
  const user = await authService.getUserFromAuthProvider(code)
  let userId = await authRepo.getUserIDForKey(user.key, provider)

  if(userId) {
    await userRepo.update({
      avatar: user.avatar,
      username: user.username,
    }, userId)
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

  res.cookie("accessToken", accessToken, cookieOptions(accessTokenExpiry))
  res.cookie("refreshToken", refreshToken, cookieOptions(refreshTokenExpiry))
  return res.redirect(config.webRedirectURL)
}
