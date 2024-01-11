import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from 'express'
import { httpStatus } from "@/lib/utils";
import { AppError } from "@/lib/AppError";

export function validateBody(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsedBody = schema.safeParse(req.body)
    if(parsedBody.success) {
      return next()
    }
    console.log("validate body: ", parsedBody.error.errors.flat())
    const err = new AppError(httpStatus.UNPROCESSABLE_ENTITY, "Invalid body")
    return next(err)
  }
};
