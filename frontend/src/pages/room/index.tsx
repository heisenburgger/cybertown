import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useMe, useRoomEvents } from "@/hooks/queries"
import { appSocket } from "@/lib/AppSocket"
import { useRooms } from "@/hooks/queries"
import { Participants, RoomWidget } from "@/pages/room/components"
import { ProfileUser } from "@/types"

export type InPM = {
  participant: ProfileUser
} | null

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>

// TODO: create a new api for fetching a room by id
export function Room() {
  const { data: user } = useMe()
  const { data: rooms } = useRooms()
  const params = useParams()
  const roomId = params.roomId ? parseInt(params.roomId) : NaN
  const { data: events } = useRoomEvents(roomId)
  const room = rooms?.find(room => room.id === roomId)
  const participants = room?.participants ?? []
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // determines whether the user in involved in a private message
  const [inPM, setInPM] = useState<InPM>(null)

  useEffect(() => {
    if (!user || isNaN(roomId)) {
      console.log("missing args to join a room")
      return
    }
    appSocket.init(() => {
      appSocket.joinRoom(roomId)
    })
  }, [user?.id])

  // TODO: show cool loading status (a rocket launching?)
  if (!user || !room) {
    return null
  }

  return (
    <div className="h-full grid grid-cols-[1fr_400px]">
      <div className="flex flex-col">
        <div className="flex-1 flex items-center justify-center whitespace-pre-wrap">
          {room.metadata.welcomeMessage?.replace('[username]', user.username)}
        </div>
        <Participants participants={participants} room={room} textareaRef={textareaRef} inPM={inPM} setInPM={setInPM} />
      </div>
      <RoomWidget room={room} events={events ?? []} textareaRef={textareaRef} inPM={inPM} setInPM={setInPM} />
    </div>
  )
}
