import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getAvatarFallback, getTime } from "@/lib/utils"
import { RoomMessage } from "@/types"
import { AvatarFallback } from "@radix-ui/react-avatar"

type Props = {
  message: RoomMessage
}

export function Message(props: Props) {
  const { message } = props
  const { from } = message
  return (
    <div className="flex gap-3">
      <Avatar key={from.id} className="w-8 h-8 rounded-lg">
        <AvatarImage src={from.avatar} alt={from.username} />
        <AvatarFallback>{getAvatarFallback(from.username)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-xs text-primary">{from.username}</p>
          <p className="text-muted-foreground text-[10px]">{getTime(message.sentAt)}</p>
        </div>
        <p className="text-sm pt-1">{message.content}</p>
      </div>
    </div>
  )
}
