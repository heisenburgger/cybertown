import { useMe } from "@/hooks/queries";
import { Auth } from "./components/Auth";
import { CreateRoom } from "./components/CreateRoom";
import { useState } from "react";

export function Home() {
  const { data: user } = useMe()
  const [open, setOpen] = useState(false)

  return (
    <div className="h-full max-w-screen-xl mx-auto p-4">
      <div className="flex items-center justify-between">
        {user && <CreateRoom open={open} setOpen={setOpen} />}
        <Auth />
      </div>
    </div>
  )
}
