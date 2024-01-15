import { config as appConfig } from '@/index'

export const config = {
	worker: {
		rtcMinPort: 40000,
		rtcMaxPort: 49999,
	},
	router: {
		// add the codec for video
		mediaCodecs: [
			{
				kind: 'audio',
				mimeType: 'audio/opus',
				channels: 2,
				clockRate: 48000,
			} as const,
			{
				kind: 'video',
				mimeType: 'video/VP8',
				clockRate: 90000,
				parameters: {
					'x-google-start-bitrate': 1000,
				},
			} as const,
		],
	},
	webRtcTransport: {
		listenIps: [
			// using env var for this
			{ ip: appConfig.mediasoupListenIP, announcedIP: undefined },
		],
		initialAvailableOutgoingBitrate: 800000,
	},
};
