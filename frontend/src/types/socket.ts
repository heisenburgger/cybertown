import { Socket } from "socket.io-client"
import { ConnectTransportPayload, ConsumePayload, ConsumeResumePayload, PrivateRoomMessage, ProducePayload, ProfileUser, Room, RoomChatClearPayload, RoomChatClearedPayload, RoomCoOwnershipPayload, RoomJoinedPayload, RoomLeavePayload, RoomMessage, RoomMessageReq, RoomPrivateMessageReq, TransportDirection, TransportOptions } from "@/types"
import { RtpCapabilities } from "mediasoup-client/lib/RtpParameters"
import { ConsumerOptions } from "mediasoup-client/lib/Consumer"

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
  'room:mediasoup:consume': (data: ConsumePayload, cb: (consumerOptions: ConsumerOptions) => void) => void
  'room:mediasoup:consume:resume': (data: ConsumeResumePayload) => void
}

export interface InterServerEvents {}

export type TSocket = Socket<ServerToClientEvents, ClientToServerEvents>
