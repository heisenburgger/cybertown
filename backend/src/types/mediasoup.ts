import { on } from "events"
import { Router } from "mediasoup/node/lib/Router"
import { Worker } from "mediasoup/node/lib/Worker"
import { DtlsParameters, IceCandidate, IceParameters, MediaKind, RtpCapabilities, RtpParameters } from "mediasoup/node/lib/types"

export type WorkerRouter = {
  router: Router
  worker: Worker
}

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
}

export type ConsumePayload = {
  roomId: number
  rtpCapabilities: RtpCapabilities
  participantId: number,
}

export type ConsumeResumePayload = {
  roomId: number
  consumerId: string
}

export type TransportOptions = {
  id: string;
  iceParameters: IceParameters;
  iceCandidates: IceCandidate[];
  dtlsParameters: DtlsParameters;
}

export type ConsumerOptions = {
  id: string
  kind: 'audio' | 'video'
  rtpParameters: RtpParameters
  producerId: string
}
