import { config } from '@/config'
import { queryClient } from '@/main'
import { ProfileUser, RoomEvent, RoomMessage, TSocket, User } from '@/types'
import io from 'socket.io-client'

class AppSocket {
  socket: TSocket | null = null

  init = (cb = () => {}) =>  {
    if(this.socket) {
      cb()
      return
    }

    const url = config.apiURL.replace('/v1', '')
    this.socket = io(url)

    this.socket.on('connect', () => {
      console.log('connected to server')
      cb()
    })

    this.socket.on('room:message:received', data => {
      console.log('room:message:received', data)
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
  }
  
  joinRoom = (user: ProfileUser, roomId: number) => {
    this.socket?.emit('room:join', {
      roomId, 
      user: user,
      joinedAt: Date.now(),
    })
  }

  sendMessage = (message: RoomMessage) => {
    this.socket?.emit('room:message:send', message)
  }
}

export const appSocket = new AppSocket()
