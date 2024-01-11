import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { config } from "@/config";
import { useMe } from "@/hooks/queries";
import { authPopup } from "@/lib";
import { LogoutIcon, UserIcon } from "@/icons";
import { Link } from 'react-router-dom'
import { ConfirmLogout } from "./ConfirmLogout";
import { getAvatarFallback } from "@/lib/utils";

export function Auth() {
  const [open, setOpen] = useState(false)
  const { data: user, refetch } = useMe()

  function login() {
    const url = config.apiURL + "/auth/login"
    authPopup.appendCallback(refetch)
    authPopup.open(url, "Log in with Google")
  }

  return (
    <div className="ml-auto">
      {!user ? (
        <Button variant="outline" onClick={login}>Log In</Button>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="p-0 px-2 py-5 flex gap-4">
              <Avatar className="rounded-full h-6 w-6">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{getAvatarFallback(user.username)}</AvatarFallback>
              </Avatar>
              <p>{user.username}</p>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 flex flex-col gap-3 text-sm">
            <Link to="/profile" className="flex gap-2 items-center">
              <UserIcon stroke="#94a3b8" />
              <p>Profile</p>
            </Link>
            <div className="flex gap-2 items-center" role="button" onClick={() => setOpen(true)}>
              <LogoutIcon stroke="#94a3b8" />
              <p>Sign Out</p>
            </div>
          </PopoverContent>
        </Popover>
      )}

      <ConfirmLogout open={open} setOpen={setOpen} />
    </div>
  )
}
