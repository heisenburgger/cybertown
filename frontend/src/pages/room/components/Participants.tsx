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
import { ShieldIcon } from "lucide-react"
import { appMediasoup } from "@/lib/AppMediasoup"
import { ScreenShare } from 'lucide-react'

type Props = {
  room: SocketRoom
  participants: ProfileUser[]
}

export function Participants(props: Props) {
  const { data: user } = useMe()
  const { participants, room } = props

  function consume(participantId: number) {
    appMediasoup.consume(participantId, 'screenshare-video', (track) => {
      const videoEl = document.getElementById("screenShareStreamVideo")
      if(!videoEl) {
        throw new Error("Missing video element")
      }
      if(videoEl instanceof HTMLVideoElement) {
        videoEl.srcObject = new MediaStream([track])
      }
    })
    appMediasoup.consume(participantId, 'screenshare-audio', (track) => {
      const audioEl = document.getElementById("screenShareStreamAudio")
      if(!audioEl) {
        throw new Error("Missing audio element")
      }
      if(audioEl instanceof HTMLAudioElement) {
        audioEl.srcObject = new MediaStream([track])
      }
    })
  }

  return (
    <div className="flex gap-3 justify-center py-4 min-h-28">
      {participants.map(participant => {
        const isOwner = room.metadata.owner === participant.id
        const isCoOwner = room.metadata.coOwners?.includes(participant.id)
        return (
          <div key={participant.id} className="relative group">
            <Avatar className="w-20 h-20 rounded-lg">
              <AvatarImage src={participant.avatar} alt={participant.username} />
              <AvatarFallback className="rounded-lg">{getAvatarFallback(participant.username)}</AvatarFallback>
            </Avatar>
            {isOwner && (
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
            {isCoOwner && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="absolute left-0 bottom-0 bg-primary/60 p-1 rounded-tr-lg z-10 group-hover:bg-primary/80">
                    <ShieldIcon stroke="#FFF" strokeWidth="1" size="16" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Co-Owner</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <Overlay participant={participant} consume={consume} />
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
  consume: (participantId: number) => void
}

function Overlay(props: OverlayProps) {
  const { participant, consume } = props
  return (
    <div role="button" onClick={() => consume(participant.id)} className="absolute hidden bottom-0 h-full left-0 bg-black/70 group-hover:flex items-center justify-center flex-col gap-1">
      <ScreenShare className="group-hover:hidden" />
      <p className="text-xs text-center">{participant.username}</p>
    </div>
  )
}
