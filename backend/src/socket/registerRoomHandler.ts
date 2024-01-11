import { roomRepo } from '@/modules/room/repo'
import { TServer, TSocket } from '@/types/socket'
import { RoomMessage } from '@/types/entity-message'
import { userRepo } from '@/modules/user/repo'

export function registerRoomHandlers(io: TServer, socket: TSocket) {
  async function joinRoom(roomId: number) {
    // check if the user part of other rooms (remove from existing room)
    // check if the user is authenticated
    if(!socket.data.auth) {
      // send user joining room is failed
      return
    }
    // check if the roomID is valid
    try {
      const room = await roomRepo.getRoom(roomId)
      if(!room) {
        // send user joining room is failed
        return
      }
      if(room) {
        const user = await userRepo.get(socket.data.auth.userId)
        socket.data.user = {
          id: user.id,
          avatar: user.avatar,
          username: user.username,
        }

        // check if the user can join the room (reason: banned, kicked)
        socket.join(`${roomId}`)

        // fire an event to all connected clients about this event
        io.emit("room:participant:joined", {
          roomId,
          user: socket.data.user,
          joinedAt: Date.now(),
        })
      }
    } catch(err) {
      console.log("error: room:join:", err)
    }
  }

  function broadcastMessage(message: RoomMessage) {
    const roomId = message.roomId.toString()
    io.in(roomId).emit('room:message:broadcast', message)
  }

  function leaveRoom() {
    // TODO: prefix the roomId with identifier
    const rooms = Array.from(socket.rooms)
    rooms.forEach(room => {
      const roomId = parseInt(room)
      if(socket.data.user && !isNaN(roomId)) {
        io.emit("room:participant:left", {
          roomId: parseInt(room),
          user: socket.data.user,
          leftAt: Date.now(),
        })
      }
    })
  }

  socket.on("room:participant:join", joinRoom)
  socket.on("disconnecting", leaveRoom)
  socket.on("room:message:send", broadcastMessage)
}
