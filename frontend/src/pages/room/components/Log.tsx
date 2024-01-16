import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn, getAvatarFallback, getTime } from "@/lib/utils"
import { ProfileUser, RoomEvent } from "@/types"

type Props = {
  log: RoomLogEvent
}

type RoomLogEvent = Extract<RoomEvent, { type: `log:${string}` }>
type AttendanceLogEvent = Extract<RoomLogEvent, { type: `${string}:${'join' | 'leave'}` }>
type CoOwnershipEvent = Extract<RoomLogEvent, { type: 'log:coOwnership' }>
type ClearChatEvent = Extract<RoomLogEvent, { type: 'log:clearChat' }>
type WelcomeMessageEvent = Extract<RoomLogEvent, { type: 'log:welcomeMessage' }>

export function Log(props: Props) {
  const { log } = props
  const isAttendanceLog = log.type.endsWith(":leave") || log.type.endsWith(":join")

  let user: ProfileUser | null = null

  if(log.type === 'log:join' || log.type === 'log:leave') {
    user = log.payload.user
  } else if(log.type === 'log:coOwnership' || log.type === 'log:clearChat') {
    user = log.payload.to
  } else if(log.type === 'log:welcomeMessage') {
    user = log.payload.by
  }

  return (
    <div className="flex justify-between items-center text-muted-foreground text-xs my-3 px-3">
      {isAttendanceLog && (
       <AttendanceLog log={log as AttendanceLogEvent} />
      )}
      {log.type.endsWith(":coOwnership") && (
       <CoOwnershipLog log={log as CoOwnershipEvent} />
      )}
      {log.type.endsWith(":clearChat") && (
       <ClearChatLog log={log as ClearChatEvent} />
      )}
      {log.type.endsWith(":welcomeMessage") && (
       <WelcomeMessageLog log={log as WelcomeMessageEvent} />
      )}
      {user && (
        <Avatar key={user.id} className="w-5 h-5 rounded-sm">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback className="w-5 h-5 rounded-sm">{getAvatarFallback(user.avatar)}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

type JoinLeaveLogProps = {
  log: AttendanceLogEvent
}

function AttendanceLog(props: JoinLeaveLogProps) {
  const { log } = props
  const { user } = log.payload
  const occuredAt = log.type === 'log:join' ? log.payload.joinedAt : log.payload.leftAt
  return (
    <p>{`[${getTime(occuredAt)}]`} {user.username} {log.type === 'log:join' ? 'Joined' : 'Left'}</p>
  )
}


type CoOwnershipLogProps = {
  log: CoOwnershipEvent
}

function CoOwnershipLog(props: CoOwnershipLogProps) {
  const { log } = props
  const { by, to, type } = log.payload
  return (
    <p className={cn({
      'text-yellow-500': type === 'set',
      'text-red-500': type === 'unset',
    })}>{by.username} has {type} {to.username} to Co-Owner</p>
  )
}

type ClearChatLogProps = {
  log: ClearChatEvent
}

function ClearChatLog(props: ClearChatLogProps) {
  const { log } = props
  const { by, to } = log.payload
  return (
    <p className="text-red-500">{by.username} has removed all messages of {to.username}</p>
  )
}

type WelcomeMessageLogProps = {
  log: WelcomeMessageEvent
}

function WelcomeMessageLog(props: WelcomeMessageLogProps) {
  const { log } = props
  const { by } = log.payload
  return (
    <p className="text-yellow-500">{by.username} has updated the welcome message</p>
  )
}
