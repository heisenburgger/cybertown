import { config } from '@/config'
import io from 'socket.io-client'
import { queryClient } from '@/lib/queryClient'
import { RoomChatClearPayload, RoomEvent, RoomMessageReq, RoomPrivateMessageReq, TSocket, User } from '@/types'

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

    this.socket.on('room:message:broadcast', data => {
      console.log('room:message:broadcast', data)
      queryClient.setQueriesData({
        queryKey: ['room:events', data.roomId]
      }, (oldData) => {
          const events = oldData as RoomEvent[]
          const event: RoomEvent = {
            type: 'message',
            payload: data
          }
          return [...events, event]
      })
    })

    this.socket.on('room:participant:joined', data => {
      console.log('room:participant:joined:', data)
      queryClient.setQueriesData({
        queryKey: ['room:events', data.roomId]
      }, (oldData) => {
          const me: User | undefined = queryClient.getQueryData(['me'])
          if(me?.id === data.user.id) {
            return
          }
          const events = oldData as RoomEvent[]
          const event: RoomEvent = {
            type: 'log:join',
            payload: data
          }
          return [...events, event]
      })
      queryClient.invalidateQueries({
        queryKey: ['rooms']
      })
    })

    this.socket.on('room:updated', data => {
      console.log('room:updated:', data)
      queryClient.invalidateQueries({
        queryKey: ['rooms']
      })
    })

    this.socket.on('room:created', data => {
      console.log('room:created:', data)
      queryClient.invalidateQueries({
        queryKey: ['rooms']
      })
    })

    this.socket.on('room:participant:left', data => {
      console.log('room:participant:left:', data)
      queryClient.setQueriesData({
        queryKey: ['room:events', data.roomId]
      }, (oldData) => {
          const events = oldData as RoomEvent[]
          const event: RoomEvent = {
            type: 'log:leave',
            payload: data
          }
          return [...events, event]
      })
      queryClient.invalidateQueries({
        queryKey: ['rooms']
      })
    })


    this.socket.on('room:coOwnership:updated', data => {
      console.log('room:coOwnership:updated', data)
      queryClient.setQueriesData({
        queryKey: ['room:events', data.roomId]
      }, (oldData) => {
          const events = oldData as RoomEvent[]
          const event: RoomEvent = {
            type: 'log:coOwnership',
            payload: data
          }
          return [...events, event]
      })
      queryClient.invalidateQueries({
        queryKey: ['rooms']
      })
    })

    this.socket.on('room:chat:cleared', data => {
      console.log('room:chat:cleared', data)
      queryClient.setQueriesData({
        queryKey: ['room:events', data.roomId]
      }, (oldData) => {
          const events = oldData as RoomEvent[]
          const event: RoomEvent = {
            type: 'log:clearChat',
            payload: data
          }
          return [...events, event].map(event => {
            if(event.type === 'message' && event.payload.from.id === data.to.id) {
              return {
                ...event,
                payload: {
                  ...event.payload,
                  content: "",
                  isDeleted: true,
                }
              }
            }
            return event
          })
      })
      queryClient.invalidateQueries({
        queryKey: ['rooms']
      })
    })
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
}

export const appSocket = new AppSocket()
