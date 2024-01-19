import { SocketRoom } from "@/types";
import { WelcomeMessage } from "./WelcomeMessage";
import { useMe } from "@/hooks/queries";
import { CreateRoom } from "@/pages/home/components";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useRoomStore } from "@/stores";

type Props = {
  room: SocketRoom
}

export function Settings(props: Props) {
  const [open, setOpen] = useState(false)
  const { data: user } = useMe()
  const { room } = props
  const welcomeMessage = room.metadata.welcomeMessage ?? ""
  const isOwner = room.metadata.owner === user?.id
  const isCoOwner = room.metadata.coOwners?.includes(user?.id as number)
  const settings = useRoomStore(state => state.settings)
  const setSettings = useRoomStore(state => state.setSettings)

  return (
    <div className="h-full px-3 py-1 flex flex-col gap-5">
      {isOwner && (
        <CreateRoom open={open} setOpen={setOpen} mode="edit" roomId={room.id} defaultValues={{
          topic: room.topic ?? "",
          maxParticipants: room.maxParticipants.toString(),
          language: room.language,
        }}>
          <Button variant="outline" className="self-end flex gap-2">
            <span><Pencil strokeWidth="1" size="15" /></span>
            <span>Edit Room</span>
          </Button>
        </CreateRoom>
      )}

      {(isOwner || isCoOwner) && (
        <WelcomeMessage welcomeMessage={welcomeMessage} room={room} />
      )}

      <div className="flex justify-between items-center mt-3">
        <p>Notification Sound</p> 
        <Switch checked={settings.notification} onCheckedChange={value => setSettings("notification", value)} />
      </div>
    </div>
  )
}
