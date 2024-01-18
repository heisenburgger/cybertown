import { Textarea } from "@/components/ui/textarea"
import { useMe } from "@/hooks/queries"
import { appSocket } from "@/lib/socket/AppSocket"
import { RoomMessageReq, RoomPrivateMessageReq } from "@/types"
import { Log, Message } from '@/pages/room/components'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getAvatarFallback } from "@/lib/utils"
import { XCircle } from "lucide-react"
import { useRoomStore } from "@/stores"
import { useEffect, useRef, useState } from "react"
import { EmojiPicker } from "@/components/EmojiPicker"
import { useShallow } from "zustand/react/shallow"

type Props = {
  roomId: number
}
 
export function Messages(props: Props) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { roomId } = props
  const { data: user } = useMe()
  const inPMWith = useRoomStore(state => state.inPMWith)
  const setInPMWith = useRoomStore(state => state.setInPMWith)
  const events = useRoomStore(useShallow(state => state.events))
  const [open, setOpen] = useState(false)

  function sendMessage(content: string) {
    if(!user || !textareaRef.current) {
      return
    }
    if(inPMWith) {
      const message: RoomPrivateMessageReq = {
        content,
        participantId: inPMWith.id,
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

  useEffect(() => {
    if(messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [events])

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 py-1 flex flex-col chat">
        {events.map((event, i) => {
          if(event.type === 'message') {
            const message = event.payload
            return <Message key={message.id} message={message}  />
          }
          return <Log key={i} log={event} />
        })}
        <div className="mt-1" ref={messagesEndRef} />
      </div>
      <div className="m-4 border shadow-xl rounded-sm">
        {inPMWith && (
          <div className="flex items-center justify-between bg-red-500/10 p-1 px-2">
            <div className="flex gap-3 items-center">
              <Avatar key={inPMWith.id} className="rounded-lg w-8 h-8">
                <AvatarImage src={inPMWith.avatar} alt={inPMWith.username} />
                <AvatarFallback className="rounded-lg">{getAvatarFallback(inPMWith.username)}</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="text-xs">Send private message to:</p>
                <p className="text-primary">{inPMWith.username}</p>
              </div>
            </div>
            <div role="button" onClick={() => setInPMWith(null)}>
              <XCircle strokeWidth="1" size="14" />
            </div>
          </div>
        )}
        <Textarea id="sendMessage" className="border-0 p-3" ref={textareaRef} disabled={!user} placeholder="Type your message here" onKeyDown={e => {
          if(e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            const value = e.currentTarget.value.trim()
            if(value.length) {
              sendMessage(e.currentTarget.value)
            }
          }
        }} />
        <div className="border-t flex flex-col p-3 py-2">
          <EmojiPicker open={open} setOpen={setOpen} onSelect={emoji => {
            if(textareaRef.current) {
              const emojiText = `<em-emoji size="1.5em" id="${emoji}"></em-emoji>`
              sendMessage(emojiText)
              setOpen(false)
            }
          }} />
        </div>
      </div>
    </div>
  )
}
