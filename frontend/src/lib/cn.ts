import { twMerge } from 'tailwind-merge'
import clsx, { type ClassValue } from 'clsx'

export function cn(...input: ClassValue[]) {
  return twMerge(clsx(input))
}
