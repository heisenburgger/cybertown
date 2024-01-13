import { prefixedRoomId } from "@/lib/utils";
import { TServer, TSocket } from "@/types/socket";
import { appMediasoup } from "..";
import { TNull } from "@/mediasoup/Peer";
import { getTransportOptions } from "@/mediasoup/util";
import { ConnectTransportPayload, ConsumePayload, ConsumeResumePayload, ConsumerOptions, ProducePayload } from "@/types/mediasoup";
import { Producer } from "mediasoup/node/lib/Producer";

export function registerMediasoupHandler(_io: TServer, socket: TSocket) {
  async function createTransport(roomId: number) {
    const socketRoomId = prefixedRoomId(roomId)
    const isInRoom = socket.rooms.has(socketRoomId)
    if(!isInRoom) {
      console.log("error: createTransport: not in room")
      return
    }

    const userId = socket.data.auth?.userId!

    const sendTransport = await appMediasoup.createTransport({
      roomId: socketRoomId,
      userId,
      direction: 'send'
    })

    const recvTransport = await appMediasoup.createTransport({
      roomId: socketRoomId,
      userId,
      direction: 'recv'
    })

    if(!sendTransport || !recvTransport) {
      return
    }

    appMediasoup.updatePeer(socketRoomId, userId, {
      sendTransport,
      recvTransport,
    })

    socket.emit('room:mediasoup:transportOptions', {
      'recv': getTransportOptions(recvTransport),
      'send': getTransportOptions(sendTransport),
    })
  }

  function connectTransport(data: ConnectTransportPayload) {
    const socketRoomId = prefixedRoomId(data.roomId)
    const isInRoom = socket.rooms.has(socketRoomId)
    if(!isInRoom) {
      console.log("error: createTransport: not in room")
      return
    }
    const userId = socket.data.auth?.userId!
    const peer = appMediasoup.getPeer(socketRoomId, userId)
    appMediasoup.connectTransport({
      peer,
      roomId: socketRoomId,
      direction: data.direction,
      dtlsParameters: data.dtlsParameters
    })
    console.log("info: connectTransport: connected")
  }

  async function produce(data: ProducePayload, cb: (producerId: string) => void) {
    const socketRoomId = prefixedRoomId(data.roomId)
    const isInRoom = socket.rooms.has(socketRoomId)
    if(!isInRoom) {
      console.log("error: createTransport: not in room")
      return
    }
    const userId = socket.data.auth?.userId!
    const producer = await appMediasoup.produce({
      userId,
      roomId: socketRoomId,
      kind: data.kind,
      roomKind: data.roomKind,
      rtpParameters: data.rtpParameters
    })
    if(!producer) {
      return
    }
    const peer = appMediasoup.getPeer(socketRoomId, userId)
    const producers = [...peer.producers, producer]
    appMediasoup.updatePeer(socketRoomId, userId, {
       producers
    })
    console.log("mediasoup handler: created producer")
    cb(producer.id)
  }

  async function consume(data: ConsumePayload, cb: (options: ConsumerOptions) => void) {
    const socketRoomId = prefixedRoomId(data.roomId)
    const isInRoom = socket.rooms.has(socketRoomId)
    if(!isInRoom) {
      console.log("error: consume: not in room")
      return
    }
    const userId = socket.data.auth?.userId!

    const producerPeer = appMediasoup.getPeer(socketRoomId, data.participantId)
    if(!producerPeer) {
      console.log('error: consume: missing peer')
    }

    const producer = producerPeer.producers.find(producer => producer.appData.roomKind === data.roomKind)
    if(!producer) {
      console.log('error: consume: missing producer')
      return
    }

    const consumer = await appMediasoup.consume({
      userId,
      roomKind: data.roomKind,
      roomId: socketRoomId,
      producerId: producer.id,
      rtpCapabilities: data.rtpCapabilities
    })

    if(!consumer) {
      return
    }
    const peer = appMediasoup.getPeer(socketRoomId, userId)
    appMediasoup.updatePeer(socketRoomId, userId, {
      consumers: [...peer.consumers, consumer]
    })
    cb({
      producerId: producer.id,
      rtpParameters: consumer.rtpParameters,
      kind: consumer.kind,
      id: consumer.id
    })
    console.log("created consumer")
  }

  async function consumeResume(data: ConsumeResumePayload) {
    const socketRoomId = prefixedRoomId(data.roomId)
    const isInRoom = socket.rooms.has(socketRoomId)
    if(!isInRoom) {
      console.log("error: consume: not in room")
      return
    }
    const userId = socket.data.auth?.userId!
    appMediasoup.consumeResume({
      roomId: socketRoomId,
      userId,
      consumerId: data.consumerId
    })
    console.log("info: consumer resumed")
  }

  socket.on('room:mediasoup:transport:create', createTransport)
  socket.on('room:mediasoup:transport:connect', connectTransport)
  socket.on('room:mediasoup:produce', produce)
  socket.on('room:mediasoup:consume', consume)
  socket.on('room:mediasoup:consume:resume', consumeResume)
}
