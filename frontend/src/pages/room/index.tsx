import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import { useMe, useRoomEvents } from "@/hooks/queries"
import { appSocket } from "@/lib/AppSocket"
import { useRooms } from "@/hooks/queries"
import { Participants, RoomWidget } from "@/pages/room/components"
import { ProfileUser } from "@/types"
import { cn } from "@/lib/utils"

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
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isConsuming, setIsConsuming] = useState(false)
  const isVideoPlaying = isScreenSharing || isConsuming

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
        <div className="flex-1 flex flex-col items-center justify-center whitespace-pre-wrap">
          <div className="h-[60px] border-b">
          </div>
          <div className="relative border border-r-0 w-full h-full flex items-center justify-center">
            <video autoPlay id="screenShareStream" className={cn("border-red-500 absolute h-full w-full", {
              'hidden': !isVideoPlaying
            })} />
            {!isVideoPlaying && <p>{room.metadata.welcomeMessage?.replace('[username]', user.username)}</p>}
          </div>
        </div>
        <Participants participants={participants} room={room} textareaRef={textareaRef} inPM={inPM} setInPM={setInPM} isConsuming={isConsuming} setIsConsuming={setIsConsuming} />
      </div>
      <RoomWidget room={room} events={events ?? []} textareaRef={textareaRef} inPM={inPM} setInPM={setInPM} isScreenSharing={isScreenSharing} setIsScreenSharing={setIsScreenSharing} />
    </div>
  )
}
