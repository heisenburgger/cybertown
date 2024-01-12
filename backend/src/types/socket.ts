import { Server, Socket } from "socket.io"
import { ProfileUser, Room } from "./entity"
import { RoomChatClearPayload, RoomChatClearedPayload, RoomCoOwnershipPayload, RoomJoinedPayload, RoomLeavePayload, RoomMessageReq, RoomPrivateMessageReq } from "./event-payload"
import { PrivateRoomMessage, RoomMessage } from "./entity-message"

export interface ServerToClientEvents {
  'room:participant:joined': (data: RoomJoinedPayload) => void
  'room:participant:left': (data: RoomLeavePayload) => void
  'room:message:broadcast': (message: RoomMessage | PrivateRoomMessage) => void
  'room:created': (room: Room) => void
  'room:updated': (room: Room) => void
  'room:coOwnership:updated': (data: RoomCoOwnershipPayload) => void
  'room:chat:cleared': (data: RoomChatClearedPayload) => void
}

export interface ClientToServerEvents {
  'room:participant:join': (roomId: number) => void
  'room:message:send': (data: RoomMessageReq) => void
  'room:privateMessage:send': (data: RoomPrivateMessageReq) => void
  'room:chat:clear': (data: RoomChatClearPayload) => void
}


export interface InterServerEvents { }

export interface SocketData {
  user: ProfileUser
  auth: {
    sessionId: number
    userId: number
  } | null
}

export type TServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
export type TSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
