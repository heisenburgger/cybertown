import { CookieOptions } from "express";

export function cookieOptions(maxAge: number): CookieOptions {
  return {
    maxAge,
    httpOnly: true,
  }
}
