import { Socket } from 'socket.io-client';
import {
	ConnectTransportPayload,
	ConsumePayload,
	ConsumeResumePayload,
	PrivateRoomMessage,
	ProducePayload,
	Room,
	RoomChatClearPayload,
	RoomChatClearedPayload,
	RoomCoOwnershipPayload,
	RoomJoinedPayload,
	RoomLeavePayload,
	RoomMessage,
	RoomMessageReq,
	RoomPrivateMessageReq,
	TransportDirection,
	TransportOptions,
  ProduceStopPayload,
  ConsumeStopPayload,
  RoomWelcomeMessagePayload,
} from '@/types';
import { ConsumerOptions } from 'mediasoup-client/lib/Consumer';
import { ParticipantState } from '@/stores/useRoomStore'

export interface ServerToClientEvents {
	'room:participant:joined': (data: RoomJoinedPayload) => void;
	'room:participant:left': (data: RoomLeavePayload) => void;
	'room:message:broadcast': (message: RoomMessage | PrivateRoomMessage) => void;
	'room:created': (room: Room) => void;
	'room:updated': (room: Room) => void;
	'room:coOwnership:updated': (data: RoomCoOwnershipPayload) => void;
  'room:welcomeMessage:updated': (data: RoomWelcomeMessagePayload) => void
	'room:chat:cleared': (data: RoomChatClearedPayload) => void;

  // mediasoup
	'room:mediasoup:transportOptions': (
		tpOptions: Record<TransportDirection, TransportOptions>,
	) => void;
  'room:mediasoup:consume:stop': (data: ConsumeStopPayload) => void;
  'room:mediasoup:state': (state: Record<number, ParticipantState>) => void;
}

export interface ClientToServerEvents {
	'room:participant:join': (roomId: number) => void;
	'room:message:send': (data: RoomMessageReq) => void;
	'room:privateMessage:send': (data: RoomPrivateMessageReq) => void;
	'room:chat:clear': (data: RoomChatClearPayload) => void;

  // mediasoup
	'room:mediasoup:transport:create': (roomId: number) => void;
	'room:mediasoup:transport:connect': (data: ConnectTransportPayload) => void;
	'room:mediasoup:produce': (
		data: ProducePayload,
		cb: (producerId: string) => void,
	) => void;
  'room:mediasoup:produce:stop': (
    data: ProduceStopPayload,
  ) => void;
	'room:mediasoup:consume': (
		data: ConsumePayload,
		cb: (consumerOptions: ConsumerOptions) => void,
	) => void;
	'room:mediasoup:consume:resume': (data: ConsumeResumePayload) => void;
}

export interface InterServerEvents {}

export type TSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
