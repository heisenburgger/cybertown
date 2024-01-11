import { roomRepo } from '@/room'
import { RoomJoinPayload, TServer, TSocket } from './types'
import { RoomMessage } from '@/types'

export function registerRoomHandlers(io: TServer, socket: TSocket) {
  async function joinRoom(data: RoomJoinPayload) {
    // check if the user part of other rooms (remove from existing room)
    // check if the user is authenticated
    // check if the roomID is valid
    try {
      const room = await roomRepo.getRoom(data.roomId)
      console.log("room:join [room]:", room?.id)
      if(!room) {
        console.log("room:join no room")
        // send user joining room is failed
        return
      }
      if(room) {
        socket.data.user = data.user
        // check if the user can join the room (reason: banned, kicked)
        socket.join(data.roomId.toString())

        // fire an event to all connected clients about this event
        io.emit("room:participant:joined", data)
        console.log("room:joined room")
      }
    } catch(err) {
      console.log("error: room:join:", err)
    }
  }

  function broadcastMessage(message: RoomMessage) {
    const roomId = message.roomId.toString()
    io.in(roomId).emit('room:message:received', message)
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

  socket.on("room:join", joinRoom)
  socket.on("disconnecting", leaveRoom)
  socket.on("room:message:send", broadcastMessage)
}
