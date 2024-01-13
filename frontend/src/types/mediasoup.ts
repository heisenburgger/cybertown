import { DtlsParameters, IceCandidate, IceParameters, MediaKind, RtpCapabilities, RtpParameters } from 'mediasoup-client/lib/types'

export type TransportDirection = 'send' | 'recv'

export type CreateTransportPayload = {
  roomId: number
  direction: TransportDirection
}

export type ConnectTransportPayload = {
  dtlsParameters: DtlsParameters
  direction: TransportDirection,
  roomId: number
}

export type ProducePayload = {
  kind: MediaKind
  rtpParameters: RtpParameters
  roomId: number
  roomKind: RoomMediaKind
}

export type ConsumePayload = {
  roomId: number
  rtpCapabilities: RtpCapabilities
  participantId: number,
  roomKind: RoomMediaKind
}

export type ConsumeResumePayload = {
  roomId: number
  consumerId: string
  roomKind: RoomMediaKind
  participantId: number
}

export type TransportOptions = {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
}

export type RoomMediaKind = 'screenshare' | 'webcam' | 'microphone';

export type ProduceStopPayload = {
  roomId: number
  roomKind: RoomMediaKind
}

export type ConsumeStopPayload = {
  consumerId: string
  producerId: string
  roomKind: RoomMediaKind
}
