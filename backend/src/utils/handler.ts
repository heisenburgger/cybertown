import { Request, Response, NextFunction } from 'express'
import { AppError, httpStatus } from '@/utils'

export function notFoundHandler(_req: Request, res: Response, _next: NextFunction){
   return res.status(httpStatus.NOT_FOUND).send({ error: 'The resource is not found' })
}

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if(err instanceof AppError) {
    return res.status(err.statusCode).send({ error: err.message })
  }
  return res.status(500).send('Internal Server Error')
}

// TODO: why this isn't working?
type AsyncHandlerCallback = (req: Request, res: Response, next: NextFunction) => any
export function asyncHandler(cb: AsyncHandlerCallback) {
  return (req: Request, res: Response, next: NextFunction) => {
    return cb(req, res, next)?.catch(next)
  }
}
