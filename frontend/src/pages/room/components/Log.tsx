import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarFallback, getTime } from "@/lib/utils"
import { RoomEvent } from "@/types"

type Props = {
  log: RoomLogEvent
}

type RoomLogEvent = Exclude<RoomEvent, { type: 'message' }>

export function Log(props: Props) {
  const { log } = props
  const { user } = log.payload
  const occuredAt = log.type === 'log:join' ? log.payload.joinedAt : log.payload.leftAt

  return (
    <div className="flex justify-between items-center text-muted-foreground text-xs my-1.5">
      <p>{`[${getTime(occuredAt)}]`} {user.username} {log.type === 'log:join' ? 'Joined' : 'Left'}</p>
      <Avatar key={user.id} className="w-5 h-5 rounded-sm">
        <AvatarImage src={user.avatar} alt={user.username} />
        <AvatarFallback>{getAvatarFallback(user.avatar)}</AvatarFallback>
      </Avatar>
    </div>
  )
}
