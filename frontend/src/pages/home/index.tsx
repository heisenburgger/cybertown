import { useMe } from "@/hooks/queries";
import { Auth } from "./components/Auth";
import { CreateRoom } from "./components/CreateRoom";
import { useEffect, useState } from "react";
import { useRooms } from "@/hooks/queries/useRooms";
import { appSocket } from "@/lib/AppSocket";
import { RoomCard } from "./components/RoomCard";

// TODO: show skeleton loader and empty state for rooms
export function Home() {
  const { data: user } = useMe()
  const [open, setOpen] = useState(false)
  const { data: rooms } = useRooms()

  // I should probably put this in a layout but let's go
  useEffect(() => {
    appSocket.init()
  }, [])

  return (
    <div className="h-full max-w-screen-xl mx-auto p-4">
      <div className="flex items-center justify-between">
        {user && <CreateRoom open={open} setOpen={setOpen} />}
        <Auth />
      </div>
      <div className="cards mt-12">
        {rooms?.map(room => {
          return (
            <RoomCard key={room.id} room={room} />
          )
        })}
      </div>
    </div>
  )
}
