import { Socket } from "socket.io-client"
import { ProfileUser } from "./entity"
import { Room, RoomJoinPayload, RoomLeavePayload, RoomMessage } from "@/types"

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

export type TSocket = Socket<ServerToClientEvents, ClientToServerEvents>
