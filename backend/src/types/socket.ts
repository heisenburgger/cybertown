import { Server, Socket } from "socket.io"
import { ProfileUser, Room } from "./entity"
import { RoomJoinPayload, RoomLeavePayload } from "./event-payload"
import { RoomMessage } from "./entity-message"

export interface ServerToClientEvents {
  'room:participant:joined': (data: RoomJoinPayload) => void
  'room:participant:left': (data: RoomLeavePayload) => void
  'room:message:broadcast': (data: RoomMessage) => void
  'room:created': (data: Room) => void
  'room:updated': (data: Room) => void
}

export interface ClientToServerEvents {
  'room:participant:join': (data: RoomJoinPayload) => void
  'room:message:send': (data: RoomMessage) => void
}

export interface InterServerEvents { }

export interface SocketData {
  user: ProfileUser
}

export type TServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
export type TSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
