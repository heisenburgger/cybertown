import {
  RtpCodecCapability,
  WorkerLogTag,
} from "mediasoup/node/lib/types";

export const mediasoupConfig = {
  httpIp: "0.0.0.0",
  httpPort: 3000,
  httpPeerStale: 360000,
  mediasoup: {
    worker: {
      rtcMinPort: 40000,
      rtcMaxPort: 49999,
      logLevel: "debug",
      logTags: [
        "info",
        "ice",
        "dtls",
        "rtp",
        "srtp",
        "rtcp",
      ] as WorkerLogTag[],
    } as const,
    router: {
      mediaCodecs: [
        {
          kind: "audio",
          mimeType: "audio/opus",
          clockRate: 48000,
          channels: 2,
        },
        {
          kind: 'video',
          mimeType: 'video/VP8',
          clockRate: 90000,
          parameters: {
            'x-google-start-bitrate': 1000,
          },
        },
      ] as RtpCodecCapability[],
    },
    webRtcTransport: {
      listenIps: [
        {
          ip: "127.0.0.1", // TODO: should come from env var
          announcedIp: undefined,
        },
      ],
      initialAvailableOutgoingBitrate: 800000,
    },
  },
}
