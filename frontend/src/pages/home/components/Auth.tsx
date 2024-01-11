import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { config } from "@/config";
import { Link } from 'react-router-dom'
import { ConfirmLogout } from "@/pages/home/components";
import { getAvatarFallback } from "@/lib/utils";
import { useMe } from "@/hooks/queries";
import { authPopup } from "@/lib/Popup";
import { LogoutIcon, UserIcon } from "@/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
        <Button variant="outline" className="rounded-lg" onClick={login}>Log In</Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="p-0 px-2 py-5 flex gap-4 rounded-lg">
              <Avatar className="rounded-full h-6 w-6">
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback className="text-xs">{getAvatarFallback(user.username)}</AvatarFallback>
              </Avatar>
              <p>{user.username}</p>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="dropdown-content">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="flex gap-2 items-center">
                <UserIcon stroke="#94a3b8" />
                <p>Profile</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <div className="flex gap-2 items-center" role="button" onClick={() => setOpen(true)}>
                <LogoutIcon stroke="#94a3b8" />
                <p>Sign Out</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <ConfirmLogout open={open} setOpen={setOpen} />
    </div>
  )
}
