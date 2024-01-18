import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SocketRoom, WidgetTab } from "@/types"
import { Apps, Settings, Messages } from '@/pages/room/components'
import { Mail, Settings as SettingsIcon, LayoutGrid } from 'lucide-react'
import { useRoomStore } from "@/stores"

type Props = {
  room: SocketRoom
}

export function RoomWidget(props: Props) {
  const { room } = props
  const setWidgetTab = useRoomStore(state => state.setWidgetTab)
  const widgetTab = useRoomStore(state => state.widgetTab)

  return (
    <Tabs defaultValue="messages" className="border-l flex flex-col data-[state=active]:*:flex-1" value={widgetTab} onValueChange={(tab) => setWidgetTab(tab as WidgetTab)}>
      <TabsList className="w-[96%] mx-auto mt-2 flex justify-between *:flex-1">
        <TabsTrigger value="messages" className="flex gap-2 items-center rounded-md">
          <Mail strokeWidth="1" size="16" />
          <span>Messages</span>
        </TabsTrigger>
        <TabsTrigger value="apps" className="flex gap-2 items-center rounded-md">
          <LayoutGrid strokeWidth="1" size="16" />
          <span>Apps</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex gap-2 items-center rounded-md">
          <SettingsIcon strokeWidth="1" size="16" />
          <span>Settings</span>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="messages">
        <Messages roomId={room.id} />
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

