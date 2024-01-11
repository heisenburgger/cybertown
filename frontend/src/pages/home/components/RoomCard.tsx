import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link } from "react-router-dom"
import { getAvatarFallback } from "@/lib/utils"
import { SocketRoom } from "@/types"

type Props = {
  room: SocketRoom
}

export function RoomCard(props: Props) {
  const { room } = props

  return (
    <div className="border p-4 shadow-lg flex flex-col rounded-lg">
      <p className="font-medium text-lg">{room.topic || '-'}</p>
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
      <Link to={`/rooms/${room.id}`} className="self-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg">
        Join Now
      </Link>
    </div>
  )
}
