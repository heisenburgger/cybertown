import { Response, Request, NextFunction } from 'express'
import { userRepo } from '@/modules/user/repo'

export async function meHandler(_req: Request, res: Response, _next: NextFunction) {
  const userId = res.locals.userId
  const user = await userRepo.get(userId)
  res.send({ user })
}
