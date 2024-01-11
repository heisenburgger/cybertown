import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarFallback } from "@/lib/utils"
import { ProfileUser } from "@/types"

type Props = {
  participants: ProfileUser[]
}

export function Participants(props: Props) {
  const { participants } = props

  return (
    <div className="flex gap-3 justify-center py-4">
      {participants.map(participant => {
        return (
          <Avatar key={participant.id} className="w-20 h-20 rounded-lg">
            <AvatarImage src={participant.avatar} alt={participant.username} />
            <AvatarFallback>{getAvatarFallback(participant.avatar)}</AvatarFallback>
          </Avatar>
        )
      })}
    </div>
  )
}
