import { Response, Request, NextFunction } from 'express'
import { userRepo } from '@/user/repo'

export async function meHandler(_req: Request, res: Response, _next: NextFunction) {
  const userId = res.locals.userId as string
  const user = await userRepo.get(userId)
  res.send({ user })
}
