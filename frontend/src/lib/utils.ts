import { ProfileUser, User } from "@/types"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from 'dayjs'
import DOMPurify from 'dompurify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getProfileUser(user: User): ProfileUser {
  return {
    id: user.id,
    username: user.username,
    avatar: user.avatar,
  }
}

export function getAvatarFallback(username: string) {
  let fallback: string
  const segments = username.split(" ")
  if(segments.length >= 2) {
    const [first, second] = segments
    fallback = `${first[0]}${second[0]}`
  } else {
    fallback = username.slice(0, 2)
  }
  return fallback.toUpperCase()
}

export function getTime(timestamp: number) {
  return dayjs(timestamp).format("hh:mm A");
}

export function getDateTime(dateTime: string) {
  return dayjs(dateTime).format('MM-DD-YYYY hh:mm A')
}

export function cleanInput(dirty: string) {
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: ['em-emoji'] });
}
