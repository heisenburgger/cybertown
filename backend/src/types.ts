import { User } from "./db/schema"

export type Message = {
  id: string
  content: string
  from: number   // user id
  sentAt: number // epoch seconds
  isDeleted?: boolean
  isEdited?: boolean
}

export type RoomMessage = Message & {
  roomId: number
}

export type PrivateRoomMessage = RoomMessage & {
  to: number // user id
}

export type ProfileUser = Omit<User, 'bio' | 'createdAt'>
