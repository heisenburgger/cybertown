import { roomRepo } from '@/modules/room/repo'
import { TServer, TSocket } from '@/types/socket'
import { RoomMessage } from '@/types/entity-message'
import { userRepo } from '@/modules/user/repo'
import { RoomChatClearPayload, RoomMessageReq } from '@/types/event-payload'
import crypto from 'crypto'
import { prefixedRoomId } from '@/lib/utils'
import { config } from '..'
import { roomService } from '@/modules/room/service'


export function registerRoomHandlers(io: TServer, socket: TSocket) {
  async function joinRoom(roomId: number) {
    // check if the user part of other rooms (remove from existing room)
    try {
      const room = await roomRepo.getRoom(roomId)
      if (!room) {
        console.error("error: joinRoom: invalid room")
        return
      }
      const user = await userRepo.get(socket.data.auth?.userId!)
      if(!user) {
        console.error("error: joinRoom: invalid user")
        return
      }
      socket.data.user = {
        id: user.id,
        avatar: user.avatar,
        username: user.username,
      }
      // check if the user can join the room (reason: banned, kicked)
      socket.join(prefixedRoomId(roomId))
      io.emit("room:participant:joined", {
        roomId,
        user: socket.data.user,
        joinedAt: Date.now(),
      })
    } catch (err) {
      console.log("error: room:join:", err)
    }
  }

  function broadcastMessage(message: RoomMessageReq) {
    const socketRoomId = prefixedRoomId(message.roomId)
    const isInRoom = socket.rooms.has(socketRoomId)
    if (!isInRoom) {
      console.error("error: broadcastMessage: not in room")
      return
    }
    const roomMessage: RoomMessage = {
      id: crypto.randomUUID(),
      sentAt: Date.now(),
      from: socket.data.user,
      // TODO: validate the incoming `message`
      content: message.content,
      roomId: message.roomId,
    }
    io.in(socketRoomId).emit('room:message:broadcast', roomMessage)
  }

  function leaveRoom() {
    const rooms = Array.from(socket.rooms).filter(el => el.startsWith(config.roomIdPrefix))
    rooms.forEach(room => {
      const segments = room.split(":")
      const roomId = parseInt(segments[1])
      if (socket.data.user && !isNaN(roomId)) {
        io.emit("room:participant:left", {
          roomId,
          user: socket.data.user,
          leftAt: Date.now(),
        })
      }
    })
  }

  async function clearChat(data: RoomChatClearPayload) {
    // verify the user is part of the room
    const socketRoom = prefixedRoomId(data.roomId)
    const isInRoom = socket.rooms.has(socketRoom)
    if(!isInRoom) {
      console.log("error: clearChat: user not part of room")
      return
    }

    // check if the user has permissions
    const room = await roomRepo.getRoom(data.roomId)
    if(!room) {
      console.log("error: clearChat: failed to fetch room")
      return
    }
    const participantRoomRole = roomService.getRoomRole(data.participantId, room)
    const userRoomRole = roomService.getRoomRole(socket.data.auth?.userId!, room)

    if(userRoomRole === 'guest') {
      console.log("error: clearChat: unauthorized")
      return
    }

    if(participantRoomRole === 'owner') {
      console.log("error: clearChat: unauthorized")
      return
    }
    
    // verify if the participantId is valid
    const participant = await userRepo.getUserProfiles([data.participantId])
    if(!participant.length) {
      console.log("error: clearChat: participant not part of room")
      return
    }
    
    // then fire
    io.in(socketRoom).emit('room:chat:cleared', {
      to: participant[0],
      by: socket.data.user,
      roomId: data.roomId
    })
  }

  socket.on("room:participant:join", joinRoom)
  socket.on("disconnecting", leaveRoom)
  socket.on("room:message:send", broadcastMessage)
  socket.on("room:chat:clear", clearChat)
}
