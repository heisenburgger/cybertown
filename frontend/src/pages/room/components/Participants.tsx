import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CrownIcon } from "@/icons/CrownIcon"
import { getAvatarFallback } from "@/lib/utils"
import { ProfileUser, SocketRoom } from "@/types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ParticipantMenu } from "@/pages/room/components"
import { useMe } from "@/hooks/queries"

type Props = {
  room: SocketRoom
  participants: ProfileUser[]
}

export function Participants(props: Props) {
  const { data: user } = useMe()
  const { participants, room } = props

  return (
    <div className="flex gap-3 justify-center py-4">
      {participants.map(participant => {
        return (
          <div key={participant.id} className="relative group">
            <Avatar className="w-20 h-20 rounded-lg">
              <AvatarImage src={participant.avatar} alt={participant.username} />
              <AvatarFallback className="rounded-lg">{getAvatarFallback(participant.username)}</AvatarFallback>
            </Avatar>
            {participant.id === room.metadata.owner  && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="absolute left-0 bottom-0 bg-primary/60 p-1 rounded-tr-lg z-10 group-hover:bg-primary/80">
                    <CrownIcon height="13" width="13" stroke="#FFF" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Owner</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Overlay participant={participant} />
            {participant.id !== user?.id && (
              <ParticipantMenu participant={participant} room={room} />
            )}
          </div>
        )
      })}
    </div>
  )
}

type OverlayProps = {
  participant: ProfileUser
}

function Overlay(props: OverlayProps) {
  const { participant } = props 
  return (
    <div className="absolute hidden bottom-0 h-full left-0 bg-black/70 group-hover:flex items-center justify-center">
      <p className="text-xs text-center">{participant.username}</p>
    </div>
  )
}
