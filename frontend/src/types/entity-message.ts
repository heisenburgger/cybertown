import { ProfileUser } from "@/types/entity"

export type Message = {
  id: string
  content: string
  from: ProfileUser
  sentAt: number
  isDeleted?: boolean
  isEdited?: boolean
}

export type RoomMessage = Message & {
  roomId: number
}

export type PrivateRoomMessage = RoomMessage & {
  to: ProfileUser
}
