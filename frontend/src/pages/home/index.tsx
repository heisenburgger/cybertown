import { useEffect } from "react";
import { Auth } from "./components";
import io, { Socket } from 'socket.io-client'
import { useMe } from "@/hooks/queries";

let socket: Socket

const ROOM_ID = "test-room"

export function Home() {
  const { data: user } = useMe()
  function initWS() {
    if (!user) {
      return null
    }
    socket = io('http://localhost:7777')
    socket.on("connect", () => {
      console.log("established connection with the server")
      socket.emit("PING", {
        userId: user.id
      })
    })
    socket.on("ROOM_SEND_MESSAGE", (data) => {
      console.log("event: ROOM_SEND_MESSAGE:", data)
    })
    socket.on("error", () => {
      console.log("oopsie, error")
    })
  }

  function joinRoom() {
    if (!user) {
      return
    }
    socket.emit("JOIN_ROOM", {
      roomId: ROOM_ID,
      userId: user.id,
    })
  }

  useEffect(() => {
    initWS()
    // establish the socket connection to server on mount
  }, [user?.id])

  return (
    <div className="h-full p-4 max-w-screen-xl">
      <Auth />
      <button onClick={joinRoom}>
        JOIN ROOM
      </button>
      <input onKeyDown={e => {
        const value = e.currentTarget.value
        if (e.key === 'Enter') {
          socket.emit("ROOM_SEND_MESSAGE", {
            text: value,
            userId: user?.id,
            roomId: ROOM_ID,
          })
        }
      }} />
    </div>
  )
}
