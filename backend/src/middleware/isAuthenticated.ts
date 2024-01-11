import { Response, Request, NextFunction  } from 'express'
import { httpStatus } from '@/lib/utils'
import { AppError } from '@/lib/AppError'

export async function isAuthenticated(_req: Request, res: Response, next: NextFunction) {
  if(!res.locals.userId) {
    const err = new AppError(httpStatus.UNAUTHORIZED, "Unauthorized")
    next(err)
  }
  next()
}
