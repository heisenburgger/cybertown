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

export type RoomCoOwnershipPayload = {
  type: 'set' | 'unset'
  by: ProfileUser
  to: ProfileUser
  roomId: number
}

export type RoomChatClearPayload = {
  roomId: number
  participantId: number
}

export type RoomChatClearedPayload = {
  by: ProfileUser
  to: ProfileUser
  roomId: number
}
