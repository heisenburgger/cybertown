import { config } from '@/config'
import io from 'socket.io-client'
import { ConnectTransportPayload, RoomChatClearPayload, RoomMessageReq, RoomPrivateMessageReq, TSocket } from '@/types'
import { invalidateRooms, roomHandler } from './room'
import { mediasoupHandler } from './mediasoup'

class AppSocket {
  socket: TSocket | null = null

  init = (cb = () => {}) =>  {
    if(this.socket) {
      cb()
      return
    }

    const url = config.apiURL.replace('/v1', '')
    this.socket = io(url, {
      withCredentials: true,
    })

    this.socket.on('connect', () => {
      console.log('connected to server')
      cb()
    })

    this.socket.on('room:message:broadcast', roomHandler.broadcastMessage)
    this.socket.on('room:participant:joined', roomHandler.participantJoined)
    this.socket.on('room:updated', invalidateRooms)
    this.socket.on('room:created', invalidateRooms)
    this.socket.on('room:participant:left', roomHandler.participantLeft)
    this.socket.on('room:coOwnership:updated', roomHandler.coOwnershipUpdated)
    this.socket.on('room:chat:cleared', roomHandler.clearChat)

    this.socket.on('room:mediasoup:transportOptions', mediasoupHandler.transportOptions)
  }
  
  joinRoom = (roomId: number) => {
    this.socket?.emit('room:participant:join', roomId)
  }

  sendMessage = (message: RoomMessageReq) => {
    this.socket?.emit('room:message:send', message)
  }

  sendPrivateMessage = (message: RoomPrivateMessageReq) => {
    this.socket?.emit('room:privateMessage:send', message)
  }

  clearChat = (message: RoomChatClearPayload) => {
    this.socket?.emit('room:chat:clear', message)
  }

  createTransports = (roomId: number) => {
    this.socket?.emit('room:mediasoup:transport:create', roomId)
  }

  connectTransport = (data: ConnectTransportPayload) => {
    this.socket?.emit("room:mediasoup:transport:connect", data)
  }
}

export const appSocket = new AppSocket()
