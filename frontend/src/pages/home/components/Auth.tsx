import { Alert, Button } from "@/components"
import { LogoutIcon, UserIcon } from "@/icons";
import { authPopup } from "@/lib"
import * as Popover from '@radix-ui/react-popover';
import { Link } from "react-router-dom";
import { useState } from "react";
import { User } from "@/types";
import { useLogout } from "@/hooks/mutations";
import { useMe } from "@/hooks/queries";

// Auth shows the user's logged in state 
export function Auth() {
  const { data: user, refetch } = useMe()

  function handleClick() {
    const url = import.meta.env.VITE_API_URL + "/auth/login"
    authPopup.appendCallback(refetch)
    authPopup.open(url, "Sign in with Google")
  }

  return (
    <div className="flex">
       {user? (
        <LoggedIn user={user} />
      ) : (
        <Button onClick={handleClick} classes="ml-auto bg-[#7F5AF0]/10 font-bold text-[#7F5AF0] px-5 py-2 rounded-lg">
          Sign In
        </Button>
      )}
    </div>
  )
}

type LoggedIn = {
  user: User
}

function LoggedIn(props: LoggedIn) {
  const { user } = props
  const [open, setOpen] = useState(false)
  const { mutate: logoutMutate } = useLogout()

  async function logout() {
    logoutMutate()
    setOpen(false)
  }

  return (
    <>
      <Popover.Root>
        <Popover.Trigger className="w-[180px] ml-auto">
          <div className="px-4 py-2 bg-[#1B1D1E] border border-[#D9EDFE40] rounded-lg flex items-center gap-2">
            <img className="w-6 h-7 rounded-full" src={user?.avatar} alt="avatar" />
            <p className="text-ellipsis">{user?.username}</p>
          </div>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content sideOffset={4} className="bg-[#1B1D1E] px-4 py-3 flex flex-col gap-3 rounded-lg w-[180px]">
            <Link to="/profile" className="flex gap-2 items-center">
              <UserIcon />
              <p>Profile</p>
            </Link>
            <button className="flex gap-2 items-center" onClick={() => setOpen(true)}>
              <LogoutIcon />
              <p>Sign Out</p>
            </button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      <Alert title="Are you sure you want to logout?" description="Before pressing the log out button, consider your friends in cybertown" onCancel={() => setOpen(false)} open={open} setOpen={setOpen} onOk={logout}>
        {null}
      </Alert>
    </>
  )
}
