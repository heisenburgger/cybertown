import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoomEvent, SocketRoom } from "@/types"
import { Games, Settings, Messages } from '@/pages/room/components'

type Props = {
  room: SocketRoom
  events: RoomEvent[]
}

export function RoomWidget(props: Props) {
  const { events, room } = props
  return (
    <Tabs defaultValue="messages" className="border-l p-2 flex flex-col data-[state=active]:*:flex-1">
      <TabsList className="w-full flex justify-between *:flex-1">
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="games">Games</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="messages">
        <Messages roomId={room.id} events={events} />
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

