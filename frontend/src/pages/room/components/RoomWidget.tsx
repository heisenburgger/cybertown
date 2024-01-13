import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RoomEvent, SocketRoom } from "@/types"
import { Apps, Settings, Messages } from '@/pages/room/components'

// use react context to avoid prop drilling
type Props = {
  room: SocketRoom
  events: RoomEvent[]
}

export function RoomWidget(props: Props) {
  const { events, room } = props
  return (
    <Tabs defaultValue="messages" className="border-l flex flex-col data-[state=active]:*:flex-1">
      <TabsList className="w-[96%] mx-auto mt-2 flex justify-between *:flex-1">
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="apps">Apps</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="messages">
        <Messages roomId={room.id} events={events} />
      </TabsContent>
      <TabsContent value="apps">
        <Apps roomId={room.id} />
      </TabsContent>
      <TabsContent value="settings">
        <Settings room={room} />
      </TabsContent>
    </Tabs>
  )
}

