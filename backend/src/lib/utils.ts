import { CookieOptions } from "express";

export const httpStatus = {
  'OK': 200,
  'INTERNAL_SERVER_ERROR': 500,
  'UNAUTHORIZED': 401,
  'UNPROCESSABLE_ENTITY': 422,
  'NOT_FOUND': 404,
} as const

export function cookieOptions(maxAge: number): CookieOptions {
  return {
    maxAge,
    httpOnly: true,
  }
}
