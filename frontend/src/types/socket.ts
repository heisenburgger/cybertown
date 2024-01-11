import { Socket } from "socket.io-client"
import { ProfileUser } from "./entity"
import { Room, RoomChatClearPayload, RoomChatClearedPayload, RoomCoOwnershipPayload, RoomJoinedPayload, RoomLeavePayload, RoomMessage, RoomMessageReq } from "@/types"

export interface ServerToClientEvents {
  'room:participant:joined': (data: RoomJoinedPayload) => void
  'room:participant:left': (data: RoomLeavePayload) => void
  'room:message:broadcast': (message: RoomMessage) => void
  'room:created': (room: Room) => void
  'room:updated': (room: Room) => void
  'room:coOwnership:updated': (data: RoomCoOwnershipPayload) => void
  'room:chat:cleared': (data: RoomChatClearedPayload) => void
}

export interface ClientToServerEvents {
  'room:participant:join': (roomId: number) => void
  'room:message:send': (data: RoomMessageReq) => void
  'room:chat:clear': (data: RoomChatClearPayload) => void
}

export interface InterServerEvents { }

export interface SocketData {
  user: ProfileUser
}

export type TSocket = Socket<ServerToClientEvents, ClientToServerEvents>
