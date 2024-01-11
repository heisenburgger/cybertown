import { TransportDirection, TransportOptions } from '@/types'
import { Device } from 'mediasoup-client'
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters'
import { appSocket } from './AppSocket'
import { Transport } from 'mediasoup-client/lib/Transport'
import { Producer } from 'mediasoup-client/lib/Producer'
import { Consumer, ConsumerOptions } from 'mediasoup-client/lib/types'

class AppMediasoup {
  device: Device | null = null
  roomId: number | null = null
  sendTransport: Transport | null = null
  recvTransport: Transport | null = null
  producer: Producer | null = null
  consumers: Consumer[] = []

  connectTranport(transport: Transport, direction: TransportDirection) {
    transport.on('connect', (data, callback, errback) => {
      try {
        appSocket.connectTransport({
          dtlsParameters: data.dtlsParameters,
          direction,
          roomId: this.roomId!
        })
        callback()
      } catch (err) {
        if (err instanceof Error) {
          errback(err)
        }
      }
    })
  }

  createTransports(data: Record<TransportDirection, TransportOptions>) {
    if (!this.device) {
      console.log("error: createTransport: missing device")
      return
    }

    this.sendTransport = this.device.createSendTransport(data.send)
    this.recvTransport = this.device.createRecvTransport(data.recv)

    this.connectTranport(this.sendTransport, 'send')
    this.connectTranport(this.recvTransport, 'recv')

    this.listenForProduce()
  }

  listenForProduce() {
    this.sendTransport?.on("produce", (data, callback, errback) => {
      appSocket.socket?.emit("room:mediasoup:produce", {
        roomId: this.roomId!,
        kind: data.kind,
        rtpParameters: data.rtpParameters,
      }, (producerId) => {
        try {
          callback({ id: producerId })
        } catch (err) {
          console.log("error: produce callback:", err)
          if (err instanceof Error) {
            errback(err)
          }
        }
      })
    })
  }

  async loadDevice(rtpCapabilities: RtpCapabilities) {
    this.device = new Device()
    await this.device.load({
      routerRtpCapabilities: rtpCapabilities
    })
    appSocket.createTransports(this.roomId!)
  }

  async produce(track: MediaStreamTrack) {
    const producer = await this.sendTransport?.produce({
      track
    })
    if(producer) {
      this.producer = producer
    } else {
      console.log("error: failed to produce")
    }
  }

  async consume(participantId: number, cb: (track: MediaStreamTrack) => void) {
    appSocket.socket?.emit('room:mediasoup:consume', {
      roomId: this.roomId!,
      rtpCapabilities: this.device?.rtpCapabilities!,
      participantId 
    }, async (consumerOptions: ConsumerOptions) => {
      const consumer = await this.recvTransport?.consume(consumerOptions)
      if(!consumer) {
        console.log("error: failed to consume")
        return
      }
      this.consumers.push(consumer)
      cb(consumer.track)
      appSocket.socket?.emit('room:mediasoup:consume:resume', {
        roomId: this.roomId!,
        consumerId: consumer.id,
      })
    })
  }
}

export let appMediasoup = new AppMediasoup()
