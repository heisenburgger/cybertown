import mediasoup from 'mediasoup';
import {
	Router,
	Worker,
	WebRtcTransport,
	DtlsParameters,
	RtpParameters,
	MediaKind,
	Producer,
	Consumer,
	RtpCapabilities,
} from 'mediasoup/node/lib/types';
import os from 'os';
import { Peer, TNull } from '@/mediasoup/Peer';
import { config } from '@/mediasoup/config';

type TransportDirection = 'send' | 'recv';

type RoomMediaKind = 'screenshare' | 'webcam' | 'microphone';

export class AppMediasoup {
	workerIdx = 0;
	workers: Worker[] = [];
	routers: Record<number, Router> = {};
	rooms: Record<
		string,
		{
			worker: Worker;
			state: Record<number, Peer>;
		}
	> = {};

	async createWorkers() {
		const numOfCPUs = os.cpus().length;
		const workers: Worker[] = [];
		for (let i = 0; i < numOfCPUs; i++) {
			const worker = await mediasoup.createWorker({
				rtcMinPort: config.worker.rtcMinPort,
				rtcMaxPort: config.worker.rtcMaxPort,
			});
			const router = await worker.createRouter({
				mediaCodecs: config.router.mediaCodecs,
			});
			workers.push(worker);
			this.routers[worker.pid] = router;
		}
	}

	// assigns a worker for a room
	assignWorkerForRoom(roomId: string) {
		const worker = this.workers[this.workerIdx];
		this.workerIdx += 1;
		this.workerIdx %= this.workers.length;
		this.rooms[roomId] = {
			worker,
			state: {},
		};
	}

	getRouter(roomId: string) {
		const worker = this.rooms[roomId]?.worker;
		if (!worker) {
			throw new Error('missing worker');
		}
		const router = this.routers[worker.pid];
		if (!router) {
			throw new Error('missing router for worker');
		}
		return router;
	}

	getRTPCapabilities(roomId: string) {
		const router = this.getRouter(roomId);
		return router.rtpCapabilities;
	}

	addPeer(roomId: string, userId: number) {
		const room = this.rooms[roomId];
		if (!room) {
			throw new Error('missing room');
		}
		room.state[userId] = new Peer();
	}

	deletePeer(roomId: string, userId: number) {
		const room = this.rooms[roomId];
		if (!room) {
			throw new Error('missing room');
		}
		const peer = room.state[userId];
		if (!peer) {
			throw new Error('missing peer');
		}
		peer.close();
		delete room.state[userId];
	}

	async createTransport(
		data: {
			direction: TransportDirection;
			roomId: string;
			userId: number;
		},
		cb: (err: TNull<Error>, transport: TNull<WebRtcTransport>) => void,
	) {
		const { roomId, userId, direction } = data;
		const router = this.getRouter(roomId);
		if (!router) {
			cb(new Error('missing router'), null);
			return;
		}
		const transport = await router.createWebRtcTransport({
			...config.webRtcTransport,
			enableTcp: true,
			enableUdp: true,
			preferUdp: true,
			appData: {
				roomId,
				userId,
				direction,
			},
		});
		cb(null, transport);
	}

	async connectTransport(data: {
		peer: Peer;
		roomId: string;
		direction: TransportDirection;
		dtlsParameters: DtlsParameters;
	}) {
		const { peer, roomId, direction, dtlsParameters } = data;
		const router = this.getRouter(roomId);
		if (!router) {
			return;
		}
		const transport =
			direction === 'send' ? peer.sendTransport : peer.recvTransport;
		if (!transport) {
			console.error('missing transport in peer');
			return;
		}
		transport.connect({ dtlsParameters });
	}

	async produce(
		data: {
			roomId: string;
			userId: number;
			rtpParameters: RtpParameters;
			kind: MediaKind;
			roomKind: RoomMediaKind;
		},
		cb: (err: TNull<Error>, producer: TNull<Producer>) => void,
	) {
		const { rtpParameters, kind, roomId, userId, roomKind } = data;
		const room = this.rooms[roomId];
		if (!room) {
			cb(new Error('missing room'), null);
			return;
		}
		const peer = room.state[userId];
		if (!peer) {
			cb(new Error('missing peer'), null);
			return;
		}
		if (!peer.sendTransport) {
			cb(new Error('missing send transport'), null);
			return;
		}
		const producer = await peer.sendTransport.produce({
			rtpParameters,
			kind,
			appData: {
				roomId,
				userId,
				roomKind,
			},
		});
		cb(null, producer);
	}

	async consume(
		data: {
			roomId: string;
			userId: number;
			producerId: string;
			rtpCapabilities: RtpCapabilities;
			roomKind: RoomMediaKind;
		},
		cb: (err: TNull<Error>, consumer: TNull<Consumer>) => void,
	) {
		const { roomId, userId, producerId, rtpCapabilities, roomKind } = data;
		const room = this.rooms[roomId];
		if (!room) {
			cb(new Error('missing room'), null);
			return;
		}
		const peer = room.state[userId];
		if (!peer) {
			cb(new Error('missing peer'), null);
			return;
		}
		const router = this.getRouter(roomId);
		if (!router) {
			cb(new Error('missing router'), null);
			return;
		}
		const isConsumable = router.canConsume({
			producerId,
			rtpCapabilities,
		});
		if (!isConsumable) {
			cb(new Error('cannot consume'), null);
			return;
		}
		if (!peer.recvTransport) {
			cb(new Error('unable to receive transport'), null);
			return;
		}
		const consumer = await peer.recvTransport.consume({
			rtpCapabilities,
			producerId,
      paused: true,
			appData: {
				roomId,
				userId,
				roomKind,
			},
		});
    cb(null, consumer)
	}

	consumeResume(data:{
    roomId: string
    userId: number
    consumerId: string
  }) {
    const { roomId, userId, consumerId } = data
    const peer = this.rooms[roomId].state[userId]
    if(!peer) {
      console.log("missing peer")
      return
    }
    const consumer = peer.consumers.find(consumer => consumer.id === consumerId)
    if(!consumer) {
      console.log("missing consumer")
      return
    }
    consumer.resume()
  }
}
