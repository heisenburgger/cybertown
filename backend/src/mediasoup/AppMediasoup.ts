import * as mediasoup from 'mediasoup';
import {
	Router,
	Worker,
	DtlsParameters,
	RtpParameters,
	MediaKind,
	RtpCapabilities,
} from 'mediasoup/node/lib/types';
import os from 'os';
import { Peer } from '@/mediasoup/Peer';
import { config } from '@/mediasoup/config';
import { RoomMediaKind, TransportDirection } from '@/types/mediasoup';
import { ParticipantState } from '@/types/event-payload';

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
    this.workers = workers
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

	updatePeer(roomId: string, userId: number, payload: Partial<Omit<Peer, 'close'>>) {
		const room = this.rooms[roomId];
		if (!room) {
			throw new Error('missing room');
		}
		const peer = room.state[userId];
		if (!peer) {
			throw new Error('missing peer');
		}
    for(let key in payload) {
      // @ts-ignore
      this.rooms[roomId].state[userId][key] = payload[key]
    }
	}

	getPeer(roomId: string, userId: number) {
		const room = this.rooms[roomId];
		if (!room) {
			throw new Error('missing room');
		}
		const peer = room.state[userId];
		if (!peer) {
			throw new Error('missing peer');
		}
    return peer
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
		peer.close(roomId);
		delete room.state[userId];
	}

	async createTransport(
		data: {
			direction: TransportDirection;
			roomId: string;
			userId: number;
		},
	) {
		const { roomId, userId, direction } = data;
		const router = this.getRouter(roomId);
		if (!router) {
      console.log("error: AppMediasoup: createTransport: missing router")
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
    return transport
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
      console.log("error: AppMediasoup: connectTransport: missing transport in peer")
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
	) {
		const { rtpParameters, kind, roomId, userId, roomKind } = data;
		const room = this.rooms[roomId];
		if (!room) {
      console.log("error: AppMediasoup: produce: missing room")
			return;
		}
		const peer = room.state[userId];
		if (!peer) {
      console.log("error: AppMediasoup: produce: missing peer")
			return;
		}
		if (!peer.sendTransport) {
      console.log("error: AppMediasoup: produce: missing send transport")
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
    return producer
	}

  // make this less ugly once you get this working
  getState(roomId: string) {
    const room = this.rooms[roomId]
    if(!room) {
      console.log("error: AppMediasoup: getState: missing room")
      return {}
    }
    const state: Record<number, ParticipantState> = {}
    for(let key in room.state) {
      const userId = parseInt(key)
      const peer = room.state[key]
      state[userId]  = {
        producers: peer.producers.map(producer => ({
          id: producer.id,
          userId: producer.appData.userId as number,
          roomKind: producer.appData.roomKind as RoomMediaKind,
        })),
        consumers: peer.consumers.map(consumer => ({
          id: consumer.id,
          userId: consumer.appData.userId as number,
          producerId: consumer.appData.producerId as string,
          roomKind: consumer.appData.roomKind as RoomMediaKind,
        })),
      }
    }
    return state
  }

	async consume(
		data: {
			roomId: string;
			userId: number;
			producerId: string;
			rtpCapabilities: RtpCapabilities;
			roomKind: RoomMediaKind;
		},
	) {
		const { roomId, userId, producerId, rtpCapabilities, roomKind } = data;
		const room = this.rooms[roomId];
		if (!room) {
      console.log("error: AppMediasoup: consume: missing room")
			return;
		}
		const peer = room.state[userId];
		if (!peer) {
      console.log("error: AppMediasoup: consume: missing peer")
			return;
		}
		const router = this.getRouter(roomId);
		if (!router) {
      console.log("error: AppMediasoup: consume: missing router")
			return;
		}
		const isConsumable = router.canConsume({
			producerId,
			rtpCapabilities,
		});
		if (!isConsumable) {
      console.log("error: AppMediasoup: consume: failed to consume")
			return;
		}
		if (!peer.recvTransport) {
      console.log("error: AppMediasoup: consume: recv transport missing")
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
        producerId,
			},
		});
    return consumer
	}
}
