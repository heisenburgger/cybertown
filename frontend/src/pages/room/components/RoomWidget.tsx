import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Messages } from "./Messages"
import { Games } from "./Games"
import { Settings } from "./Settings"
import { RoomEvent, RoomMessage } from "@/types"

type Props = {
  roomId: number
  events: RoomEvent[]
}

export function RoomWidget(props: Props) {
  const { roomId, events } = props
  return (
    <Tabs defaultValue="messages" className="border-l p-2 flex flex-col data-[state=active]:*:flex-1">
      <TabsList className="w-full flex justify-between *:flex-1">
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="games">Games</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="messages">
        <Messages roomId={roomId} events={events} />
      </TabsContent>
      <TabsContent value="games">
        <Games />
      </TabsContent>
      <TabsContent value="settings">
        <Settings />
      </TabsContent>
    </Tabs>
  )
}

