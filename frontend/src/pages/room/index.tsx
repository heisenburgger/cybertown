import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useMe, useRoomEvents } from "@/hooks/queries"
import { appSocket } from "@/lib/AppSocket"
import { useRooms } from "@/hooks/queries"
import { Participants, RoomWidget } from "@/pages/room/components"

export function Room() {
  const { data: user } = useMe()
  const { data: rooms } = useRooms()
  const params = useParams()
  const roomId = params.roomId ? parseInt(params.roomId) : NaN
  const { data: events } =  useRoomEvents(roomId)
  const room = rooms?.find(room => room.id === roomId)
  const participants = room?.participants ?? []

  useEffect(() => {
    if(!user || isNaN(roomId)) {
      console.log("missing args to join a room")
      return
    }
    appSocket.init(() => {
      appSocket.joinRoom(roomId)
    })
  }, [user?.id])

  return (
    <div className="h-full grid grid-cols-[1fr_400px]">
      <div className="flex flex-col">
        <div className="flex-1">
        </div>
        {room && (
          <Participants participants={participants} room={room} />
        )}
      </div>
      {room && (
        <RoomWidget room={room} events={events ?? []} />
      )}
    </div>
  )
}