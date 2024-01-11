import { Response, Request, NextFunction  } from 'express'
import { AppError } from '@/utils/error'
import { httpStatus } from '@/utils/httpStatus'

export async function isAuthenticated(_req: Request, res: Response, next: NextFunction) {
  if(!res.locals.userId) {
    const err = new AppError(httpStatus.UNAUTHORIZED, "Unauthorized")
    next(err)
  }
  next()
}
