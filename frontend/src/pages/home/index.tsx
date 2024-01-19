import { useEffect, useState } from "react";
import { CreateRoom, RoomCard, Auth } from "@/pages/home/components";
import { appSocket } from "@/lib/socket/AppSocket";
import { useMe, useRooms } from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { Helmet } from 'react-helmet'
import { config } from "@/config";

// TODO: show skeleton loader and empty state for rooms
export function Home() {
  const { data: user } = useMe()
  const [open, setOpen] = useState(false)
  const { data: rooms } = useRooms()

  // I should probably put this in a layout but let's go
  useEffect(() => {
    if (!user) {
      return
    }
    appSocket.init()
  }, [user?.id])

  return (
    <div className="h-full max-w-screen-xl mx-auto p-4">
      <Helmet>
        <title>{config.siteTitle} | Home</title>
      </Helmet>

      <div className="flex items-center justify-between">
        {user && <CreateRoom open={open} setOpen={setOpen}>
          <Button variant="outline" className="rounded-lg">Create Room</Button>
        </CreateRoom>
        }
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
