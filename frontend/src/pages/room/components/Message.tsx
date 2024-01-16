import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useMe } from "@/hooks/queries"
import { cleanInput, cn, getAvatarFallback, getTime } from "@/lib/utils"
import { PrivateRoomMessage, RoomMessage } from "@/types"
import { AvatarFallback } from "@radix-ui/react-avatar"

type Props = {
  message: RoomMessage | PrivateRoomMessage
}

export function Message(props: Props) {
  const { data: user } = useMe()
  const { message } = props
  const { from } = message

  // am proud of this variable names
  const isPM = "to" in message
  const isIPMed = "to" in message && message.from.id === user?.id
  const iPMedTo = "to" in message ? message.to : null

  return (
    <div className={cn("flex gap-3 py-1.5 px-3", {
      'bg-red-500/10': isPM
    })}>
      <Avatar key={from.id} className="w-8 h-8 rounded-lg">
        <AvatarImage src={from.avatar} alt={from.username} />
        <AvatarFallback>{getAvatarFallback(from.username)}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          {(isIPMed && iPMedTo) ? (
            <div className="flex gap-2 items-center">
              <Avatar className="w-4 h-4 rounded-sm">
                <AvatarImage src={iPMedTo.avatar} alt={iPMedTo.username} />
                <AvatarFallback>{getAvatarFallback(iPMedTo.username)}</AvatarFallback>
              </Avatar>
              <p className="text-xs text-red-800">{iPMedTo.username}</p>
            </div>
          ) : (
            <p className="text-xs text-primary">{from.username}</p>
          )}
          <p className="text-muted-foreground text-[10px]">{getTime(message.sentAt)}</p>
        </div>
        <p className={cn("text-sm pt-1 break-all whitespace-pre-wrap", {
          'text-italic text-muted-foreground text-xs': message.isDeleted
        })} dangerouslySetInnerHTML={{ __html: message.isDeleted ? "This message is deleted" : cleanInput(message.content) }} />
      </div>
    </div>
  )
}
