import { WebRtcTransport } from "mediasoup/node/lib/types";

export function getTransportOptions(transport: WebRtcTransport) {
  return {
    id: transport.id,
    iceCandidates: transport.iceCandidates,
    iceParameters: transport.iceParameters,
    dtlsParameters: transport.dtlsParameters,
  }
} 

export type TransportOptions = ReturnType<typeof getTransportOptions>
