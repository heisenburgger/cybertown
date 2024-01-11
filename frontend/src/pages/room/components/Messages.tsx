import { useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { useMe } from "@/hooks/queries"
import { appSocket } from "@/lib/AppSocket"
import { getProfileUser } from "@/lib/utils"
import { RoomEvent, RoomMessage } from "@/types"
import { Log, Message } from '@/pages/room/components'

type Props = {
  roomId: number
  events: RoomEvent[]
}
 
export function Messages(props: Props) {
  const { roomId, events } = props
  const { data: user } = useMe()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function sendMessage(content: string) {
    if(!user || !textareaRef.current) {
      return
    }
    const message: RoomMessage = {
      id: crypto.randomUUID(),
      content,
      from: getProfileUser(user),
      sentAt: Date.now(),
      roomId 
    }
    appSocket.sendMessage(message)
    textareaRef.current.value = ""
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 px-2 py-1 flex flex-col gap-3">
        {events.map((event, i) => {
          if(event.type === 'message') {
            const message = event.payload
            return <Message key={message.id} message={message}  />
          }
          return <Log key={i} log={event} />
        })}
      </div>
      <div className="border">
        <Textarea ref={textareaRef} disabled={!user} placeholder="Type your message here" className="border-none" onKeyDown={e => {
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
