import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarFallback } from "@/lib/utils"
import { SocketRoom } from "@/types"
import { RoomInfo } from '@/pages/home/components'
import { Button } from "@/components/ui/button"

type Props = {
  room: SocketRoom
}

export function RoomCard(props: Props) {
  const { room } = props

  return (
    <div className="border p-4 shadow-lg flex flex-col rounded-lg">
      <div className="flex items-center justify-between">
        <p className="font-medium text-lg">{room.topic || '-'}</p>
        <RoomInfo room={room} />
      </div>
      <p className="text-muted-foreground">{room.language}</p>
      <div className="flex gap-3 my-6 flex-wrap">
        <>
          {room.participants.map(participant => {
            return (
              <Avatar key={participant.id} className="rounded-full w-14 h-14">
                <AvatarImage src={participant.avatar} alt={participant.username} />
                <AvatarFallback>{getAvatarFallback(participant.username)}</AvatarFallback>
              </Avatar>
            )
          })}
          {Array(room.maxParticipants - room.participants.length).fill(0).map((_, i) => {
            return (
              <div key={i} className="w-14 h-14 rounded-full border">
              </div>
            )
          })}
        </>
      </div>
      <Button className="self-center" onClick={() => {
        window.open(`/rooms/${room.id}`, "_blank")
      }}>
        Join Now
      </Button>
    </div>
  )
}
