import { type ClassValue, clsx } from "clsx"
import { User, ProfileUser } from '@/types'
import { twMerge } from "tailwind-merge"

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
  const date = new Date(timestamp);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
