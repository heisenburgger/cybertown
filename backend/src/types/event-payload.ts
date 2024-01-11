import { ProfileUser } from "@/types/entity"

export type RoomJoinPayload = {
  user: ProfileUser
  roomId: number
  joinedAt: number
}

export type RoomLeavePayload = {
  user: ProfileUser
  roomId: number
  leftAt: number
}
