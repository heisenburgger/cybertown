import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { useMe, useRoomEvents } from "@/hooks/queries"
import { appSocket } from "@/lib/socket/AppSocket"
import { useRooms } from "@/hooks/queries"
import { Participants, RoomHeader, RoomSidebar, RoomWidget } from "@/pages/room/components"
import { cn } from "@/lib/utils"
import { useRoomStore } from "@/stores"
import { useShallow } from 'zustand/react/shallow'

// TODO: create a new api for fetching a room by id
export function Room() {
  const { data: user } = useMe()
  const { data: rooms } = useRooms()
  const params = useParams()
  const roomId = params.roomId ? parseInt(params.roomId) : NaN
  const { data: events } = useRoomEvents(roomId)
  const room = rooms?.find(room => room.id === roomId)
  const participants = room?.participants ?? []
  const isWidgetExpanded = useRoomStore(state => state.isWidgetExpanded)

  const isVideoPlaying = useRoomStore(useShallow(state => {
    // am I sharing my screen?
    const me = state.participants[user?.id as number]
    const isScreensharing = !!me?.producers.find(producer => producer.roomKind === 'screenshare-video')

    // am I consuming some media produced by others?
    const isConsuming = !!Object.values(state.participants).map(participant => participant.consumers).flat().find(consumer => consumer.userId === user?.id as number && consumer.roomKind === 'screenshare-video')
    
    return isScreensharing || isConsuming
  }))


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
    <div className="h-full room" data-open={isWidgetExpanded}>
      <div className="flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center whitespace-pre-wrap">
          <RoomHeader />
          <div className="relative border border-r-0 w-full h-full flex items-center justify-center">
            <video autoPlay id="screenShareStreamVideo" className={cn("border-red-500 absolute h-full w-full", {
              'hidden': !isVideoPlaying
            })} />
            <audio autoPlay id="screenShareStreamAudio" className="hidden" />
            {!isVideoPlaying && <p>{room.metadata.welcomeMessage?.replace('[username]', user.username)}</p>}
          </div>
        </div>
        <Participants participants={participants} room={room} />
      </div>
      {isWidgetExpanded ? (
        <RoomWidget room={room} events={events ?? []} />
      ) : (
        <RoomSidebar />
      )}
    </div>
  )
}
