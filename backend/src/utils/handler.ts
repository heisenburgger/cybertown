import { Request, Response, NextFunction } from 'express'
import { AppError, httpStatus } from '@/utils'

type AsyncHandlerCallback = (req: Request, res: Response, next: NextFunction) => any

export function notFoundHandler(_req: Request, res: Response, _next: NextFunction){
   res.status(httpStatus.NOT_FOUND).send({ error: 'The resource is not found' })
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if(err instanceof AppError) {
    return res.status(err.statusCode).send({ error: err.message })
  }
  res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    error: 'Internal Server Error'
  })
}

export function asyncHandler(cb: AsyncHandlerCallback) {
  return (req: Request, res: Response, next: NextFunction) => {
    return cb(req, res, next)?.catch(next)
  }
}
