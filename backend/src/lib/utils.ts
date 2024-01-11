import { CookieOptions } from "express";
import { config } from "..";

export const httpStatus = {
  'OK': 200,
  'INTERNAL_SERVER_ERROR': 500,
  'UNAUTHORIZED': 401,
  'UNPROCESSABLE_ENTITY': 422,
  'NOT_FOUND': 404,
  'BAD_REQUEST': 400,
} as const

export function cookieOptions(maxAge: number): CookieOptions {
  return {
    maxAge,
    httpOnly: true,
  }
}

export function prefixedRoomId(roomId: number) {
  return config.roomIdPrefix + roomId
}

