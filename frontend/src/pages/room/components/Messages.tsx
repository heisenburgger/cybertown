import { Textarea } from "@/components/ui/textarea"
import { useMe } from "@/hooks/queries"
import { appSocket } from "@/lib/AppSocket"
import { RoomEvent, RoomMessageReq, RoomPrivateMessageReq } from "@/types"
import { Log, Message } from '@/pages/room/components'
import { InPM, SetState } from ".."
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarFallback } from "@/lib/utils"
import { XCircle } from "lucide-react"

type Props = {
  roomId: number
  events: RoomEvent[]
  textareaRef: React.RefObject<HTMLTextAreaElement>
  inPM: InPM
  setInPM: SetState<InPM>
}
 
export function Messages(props: Props) {
  const { roomId, events, inPM, setInPM, textareaRef } = props
  const { data: user } = useMe()

  function sendMessage(content: string) {
    if(!user || !textareaRef.current) {
      return
    }
    if(inPM) {
      const message: RoomPrivateMessageReq = {
        content,
        participantId: inPM.participant.id,
        roomId 
      }
      appSocket.sendPrivateMessage(message)
    } else {
      const message: RoomMessageReq = {
        content,
        roomId 
      }
      appSocket.sendMessage(message)
    }
    textareaRef.current.value = ""
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 py-1 flex flex-col">
        {events.map((event, i) => {
          if(event.type === 'message') {
            const message = event.payload
            return <Message key={message.id} message={message}  />
          }
          return <Log key={i} log={event} />
        })}
      </div>
      <div>
        {inPM && (
          <div className="flex items-center justify-between bg-red-500/10 p-1 px-2">
            <div className="flex gap-3 items-center">
              <Avatar key={inPM.participant.id} className="rounded-lg w-8 h-8">
                <AvatarImage src={inPM.participant.avatar} alt={inPM.participant.username} />
                <AvatarFallback className="rounded-lg">{getAvatarFallback(inPM.participant.username)}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="text-xs">Send private message to:</p>
                <p className="text-primary">{inPM.participant.username}</p>
              </div>
            </div>
            <div role="button" onClick={() => setInPM(null)}>
              <XCircle strokeWidth="1" size="14" />
            </div>
          </div>
        )}
        <Textarea ref={textareaRef} disabled={!user} placeholder="Type your message here" className="border rounded-none border-l-0" onKeyDown={e => {
          if(e.key === 'Enter') {
            e.preventDefault()
            const value = e.currentTarget.value.trim()
            if(value.length) {
              sendMessage(e.currentTarget.value)
            }
          }
        }} />
      </div>
    </div>
  )
}
