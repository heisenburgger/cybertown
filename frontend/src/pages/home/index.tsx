import { useState } from "react";
import { Auth } from "./components/Auth";
import { ConfirmLogout } from "./components/ConfirmLogout";

export function Home() {
  const [open, setOpen] = useState(false)

  return (
    <div className="h-full max-w-screen-xl mx-auto p-4">
      <Auth />
      <ConfirmLogout open={open} setOpen={setOpen} />
    </div>
  )
}
