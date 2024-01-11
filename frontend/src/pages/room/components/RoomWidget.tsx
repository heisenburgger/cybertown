import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoomEvent, SocketRoom } from "@/types"
import { Games, Settings, Messages } from '@/pages/room/components'
import { InPM, SetState } from ".."

type Props = {
  room: SocketRoom
  events: RoomEvent[]
  textareaRef: React.RefObject<HTMLTextAreaElement>
  inPM: InPM
  setInPM: SetState<InPM>
}

export function RoomWidget(props: Props) {
  const { events, room, inPM, setInPM, textareaRef } = props
  return (
    <Tabs defaultValue="messages" className="border-l flex flex-col data-[state=active]:*:flex-1">
      <TabsList className="w-[96%] mx-auto mt-2 flex justify-between *:flex-1">
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="games">Games</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="messages">
        <Messages roomId={room.id} events={events} inPM={inPM} setInPM={setInPM} textareaRef={textareaRef} />
      </TabsContent>
      <TabsContent value="games">
        <Games />
      </TabsContent>
      <TabsContent value="settings">
        <Settings room={room} />
      </TabsContent>
    </Tabs>
  )
}

