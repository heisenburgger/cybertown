import { ProfileUser } from "@/types/entity"
import { RtpCapabilities } from "mediasoup/node/lib/types"

export type RoomJoinedPayload = {
  roomId: number
  user: ProfileUser
  joinedAt: number
  rtpCapabilities: RtpCapabilities
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

export type RoomPrivateMessageReq = {
  content: string
  roomId: number
  participantId: number
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
