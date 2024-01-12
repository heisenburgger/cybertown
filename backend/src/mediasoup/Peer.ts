import { WebRtcTransport, Producer, Consumer } from "mediasoup/node/lib/types"

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

  close() {
    this.sendTransport?.close()
    this.recvTransport?.close()
    this.producers.forEach(producer => producer.close())
    this.consumers.forEach(consumer => consumer.close())
  }
}
