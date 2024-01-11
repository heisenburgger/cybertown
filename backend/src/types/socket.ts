import { Server, Socket } from "socket.io"
import { ProfileUser, Room } from "./entity"
import { RoomJoinedPayload, RoomLeavePayload } from "./event-payload"
import { RoomMessage } from "./entity-message"

export interface ServerToClientEvents {
  'room:participant:joined': (data: RoomJoinedPayload) => void
  'room:participant:left': (data: RoomLeavePayload) => void
  'room:message:broadcast': (message: RoomMessage) => void
  'room:created': (room: Room) => void
  'room:updated': (room: Room) => void
}

export interface ClientToServerEvents {
  'room:participant:join': (roomId: number) => void
  'room:message:send': (message: RoomMessage) => void
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
