import { mediasoupConfig as config } from '@/mediasoup/config'
import { WebRtcTransport } from "mediasoup/node/lib/WebRtcTransport";
import { Router } from "mediasoup/node/lib/Router";

export async function createTransport(
  router: Router,
) {
  const {
    listenIps,
    initialAvailableOutgoingBitrate,
  } = config.mediasoup.webRtcTransport
  const transport = await router.createWebRtcTransport({
    listenIps,
    enableUdp: true,
    enableTcp: true,
    preferUdp: true,
    initialAvailableOutgoingBitrate: initialAvailableOutgoingBitrate,
  })
  return transport
};

export function transportToOptions({
  id,
  iceParameters,
  iceCandidates,
  dtlsParameters,
}: WebRtcTransport) {
  return { id, iceParameters, iceCandidates, dtlsParameters }
}
