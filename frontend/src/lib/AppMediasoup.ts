import { RoomMediaKind, TransportDirection, TransportOptions } from '@/types'
import { Device } from 'mediasoup-client'
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters'
import { appSocket } from '@/lib/socket/AppSocket'
import { Transport } from 'mediasoup-client/lib/Transport'
import { Producer } from 'mediasoup-client/lib/Producer'
import { Consumer } from 'mediasoup-client/lib/types'

const roomKindCodecMap = {
  'screenshare-video': 'video/vp8',
  'screenshare-audio': 'audio/opus',
  'webcam': 'video/h264',
  'microphone': 'audio/opus',
}

class AppMediasoup {
  device: Device | null = null
  roomId: number | null = null
  sendTransport: Transport | null = null
  recvTransport: Transport | null = null
  producers: Producer[] = []
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
      console.log("produced data:", data)
      appSocket.produce({
        roomId: this.roomId!,
        kind: data.kind,
        rtpParameters: data.rtpParameters,
        roomKind: data.appData.roomKind as RoomMediaKind
      }, producerId => {
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

  async loadDevice(roomId: number, rtpCapabilities: RtpCapabilities) {
    this.roomId = roomId
    this.device = new Device()
    await this.device.load({
      routerRtpCapabilities: rtpCapabilities
    })
    appSocket.createTransports(this.roomId!)
  }

  async produce(track: MediaStreamTrack, roomKind: RoomMediaKind) {
    if(!this.device) {
      console.log("error: missing device when trying to produce")
      return
    }

    // https://mediasoup.org/documentation/v3/tricks/
    const codec = this.device.rtpCapabilities.codecs?.find(codec => {
       return codec.mimeType.toLowerCase() === roomKindCodecMap[roomKind]
    })

    console.log("selected codec for producer:", codec)
    
    const producer = await this.sendTransport?.produce({
      track,
      codec, 
      appData: {
        roomKind
      }
    })
    if(producer) {
      this.producers.push(producer)
    } else {
      console.log("error: failed to produce")
    }
  }

  async stopProducing(roomKind: RoomMediaKind) {
    const producer = this.producers.find(producer => producer.appData.roomKind = roomKind)
    if(!producer) {
      console.log("error: failed to stop produce: ", roomKind)
      return
    }
    producer.close()
    this.producers = this.producers.filter(producer => producer.appData.roomKind = roomKind)
  }

  async stopConsuming(roomKind: RoomMediaKind) {
    const consumer = this.consumers.find(consumer => consumer.appData.roomKind = roomKind)
    if(!consumer) {
      console.log("error: failed to stop consume: ", roomKind)
      return
    }
    consumer.close()
    this.consumers = this.consumers.filter(consumer => consumer.appData.roomKind = roomKind)
  }

  async consume(participantId: number, roomKind: RoomMediaKind, cb: (track: MediaStreamTrack, data: {
    consumerId: string
    producerId: string
  }) => void) {
    if(!this.device) {
      console.log("error: missing device to consume")
      return
    }

    appSocket.consume({
      roomId: this.roomId!,
      rtpCapabilities: this.device.rtpCapabilities,
      participantId,
      roomKind,
    }, async (consumerOptions) => {
      const consumer = await this.recvTransport?.consume(consumerOptions)
      if(!consumer) {
        console.log("error: failed to consume")
        return
      }
      this.consumers.push(consumer)
      cb(consumer.track, {
        consumerId: consumer.id,
        producerId: consumer.producerId,
      })
      appSocket.consumeResume({
        roomId: this.roomId!,
        consumerId: consumer.id,
        roomKind,
        participantId
      })
    })
  }
}

export const appMediasoup = new AppMediasoup()
