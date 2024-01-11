import { CookieOptions } from "express";

export function createCookie(maxAge: number): CookieOptions {
  return {
    maxAge,
    httpOnly: true,
  }
}
