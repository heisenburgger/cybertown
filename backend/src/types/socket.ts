import { Server, Socket } from "socket.io"
import { ProfileUser, Room } from "./entity"
import { RoomChatClearPayload, RoomChatClearedPayload, RoomCoOwnershipPayload, RoomJoinedPayload, RoomLeavePayload, RoomMessageReq, RoomPrivateMessageReq } from "./event-payload"
import { PrivateRoomMessage, RoomMessage } from "./entity-message"
import { RtpCapabilities } from "mediasoup/node/lib/RtpParameters"
import { Consumer, Producer, Transport } from "mediasoup/node/lib/types"
import { ConnectTransportPayload, ConsumePayload, ConsumeResumePayload, ConsumerOptions, ProducePayload, TransportDirection, TransportOptions } from "./mediasoup"

export interface ServerToClientEvents {
  'room:participant:joined': (data: RoomJoinedPayload) => void
  'room:participant:left': (data: RoomLeavePayload) => void
  'room:message:broadcast': (message: RoomMessage | PrivateRoomMessage) => void
  'room:created': (room: Room) => void
  'room:updated': (room: Room) => void
  'room:coOwnership:updated': (data: RoomCoOwnershipPayload) => void
  'room:chat:cleared': (data: RoomChatClearedPayload) => void
  'room:mediasoup:rtpCapabilities': (rtpCapabilities: RtpCapabilities) => void
  'room:mediasoup:transportOptions': (tpOptions: Record<TransportDirection, TransportOptions>) => void
  'room:mediasoup:produced': (participant: ProfileUser) => void
}

export interface ClientToServerEvents {
  'room:participant:join': (roomId: number) => void
  'room:message:send': (data: RoomMessageReq) => void
  'room:privateMessage:send': (data: RoomPrivateMessageReq) => void
  'room:chat:clear': (data: RoomChatClearPayload) => void
  'room:mediasoup:rtpCapabilities': (roomId: number) => void
  'room:mediasoup:transport:create': (roomId: number) => void
  'room:mediasoup:transport:connect': (data: ConnectTransportPayload) => void
  'room:mediasoup:produce': (data: ProducePayload, cb: (producerId: string) => void) => void
  'room:mediasoup:consume': (data: ConsumePayload, cb: (options: ConsumerOptions) => void) => void
  'room:mediasoup:consume:resume': (data: ConsumeResumePayload) => void
}


export interface InterServerEvents { }

export interface SocketData {
  user: ProfileUser
  auth: {
    sessionId: number
    userId: number
  } | null
  mediasoup: {
    sendTransport: null | Transport
    recvTransport: null | Transport
    producer: null | Producer
    consumers: Consumer[]
  }
}

export type TServer = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
export type TSocket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
