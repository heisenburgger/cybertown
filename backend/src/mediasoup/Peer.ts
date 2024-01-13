import { WebRtcTransport, Producer, Consumer } from "mediasoup/node/lib/types"
import { io } from ".."
import { TSocket } from "@/types/socket"
import { RoomMediaKind } from "@/types/mediasoup"

export type TNull<T> = T | null

export class Peer {
  sendTransport: TNull<WebRtcTransport>
  recvTransport: TNull<WebRtcTransport>
  producers: Producer[]
  consumers: Consumer[]

  constructor() {
    this.consumers = []
    this.producers = []
    this.recvTransport = null
    this.sendTransport = null
  }

  async close(roomId: string) {
    const sockets = await io.in(roomId).fetchSockets()
    this.sendTransport?.close()
    this.recvTransport?.close()
    this.producers.forEach(producer => producer.close())
    this.consumers.forEach(consumer => {
      const socket = sockets.find(socket =>socket.data.auth?.userId === consumer.appData.userId)
      if(!socket) {
        console.log("error: failed to find socket to stop consume")
        return
      }
      socket.emit('room:mediasoup:consume:stop', {
        consumerId: consumer.id,
        producerId: consumer.appData.producerId as string,
        roomKind: consumer.appData.roomKind as RoomMediaKind,
      })
      consumer.close()
    })
  }
}
