import { Room } from '@/db/schema'
import { Socket, Server } from 'socket.io'
import { ProfileUser, RoomMessage } from '@/types'

export interface ServerToClientEvents {
  'room:participant:joined': (data: RoomJoinPayload) => void
  'room:participant:left': (data: RoomLeavePayload) => void
  'room:message:received': (data: RoomMessage) => void
}

export interface ClientToServerEvents {
  'room:join': (data: RoomJoinPayload) => void
  'room:message:send': (data: RoomMessage) => void
}

export interface InterServerEvents { }

export interface SocketData {
  user: ProfileUser
}

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

export type RoomCreatePayload = {
  room: Room
}

export type RoomDeletePayload = {
  roomId: number
}

// TODO: how to use this in socket type annotations?
export type SocketEvent = {
  type: "room:participant:joined"
  payload: RoomJoinPayload
} | {
  type: "room:participant:left"
  payload: RoomLeavePayload
} | {
  type: "room:created"
  payload: Room
} | {
  type: "room:deleted"
  payload: RoomDeletePayload
}

export type SocketType = SocketEvent['type']
export type TServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
export type TSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
