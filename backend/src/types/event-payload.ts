import { ProfileUser } from "@/types/entity"

export type RoomJoinedPayload = {
  roomId: number
  user: ProfileUser
  joinedAt: number
}

export type RoomLeavePayload = {
  user: ProfileUser
  roomId: number
  leftAt: number
}

export type RoomMessageReq = {
  content: string
  roomId: number
}
