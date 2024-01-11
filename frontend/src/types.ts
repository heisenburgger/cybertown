import type { Socket } from 'socket.io-client'

// TODO: use monorepo to prevent this type dupication
export type User = {
  id: number
  username: string
  avatar: string
  bio: string // TODO: how to type nullable fields?
}

export type ProfileUser = Omit<User, 'bio'>

export type NewRoom = {
  language: string;
  maxParticipants: number;
  metadata: {
    owner: number;
    coOwners: number[];
    welcomeMessage?: string
  };
  topic?: string
}

export type Message = {
  id: string
  content: string
  from: ProfileUser
  sentAt: number // epoch seconds
  isDeleted?: boolean
  isEdited?: boolean
}

export type RoomMessage = Message & {
  roomId: number
}

export type RoomEvent = {
  type: "message"
  payload: RoomMessage
} | {
  type: "log:join"
  payload: RoomJoinPayload
} | {
  type: "log:leave"
  payload: RoomLeavePayload

}

export type PrivateRoomMessage = RoomMessage & {
  to: number // user id
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
  room: NewRoom & { id: string }
}

export type RoomDeletePayload = {
  roomId: number
}

export type SocketRoom = NewRoom & {
  id: number
  participants: ProfileUser[]
}

export interface ServerToClientEvents {
  'room:participant:joined': (data: RoomJoinPayload) => void
  'room:participant:left': (data: RoomLeavePayload) => void
  'room:message:received': (data: RoomMessage) => void
}

export interface ClientToServerEvents {
  'room:join': (data: RoomJoinPayload) => void
  'room:message:send': (data: RoomMessage) => void
}

export type TSocket = Socket<ServerToClientEvents, ClientToServerEvents>
