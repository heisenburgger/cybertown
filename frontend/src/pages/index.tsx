import { Button } from "@/components";
import { useUser } from "@/context/UserContext";
import { openLoginWindow } from "@/lib/openLoginWindow";

export function Home() {
  const { user, dispatch } = useUser()

  function handleClick() {
    const url = import.meta.env.VITE_API_URL + "/auth/login"
    openLoginWindow(url, "Sign in with Google", dispatch)
  }

  return (
    <div className="h-full p-4 max-w-screen-xl">
      <div className="flex">
        {user === null ? (
          <Button onClick={handleClick} classes="ml-auto bg-[#7F5AF0]/10 font-bold text-[#7F5AF0] px-5 py-2 rounded-lg">
            Sign In
          </Button>
        ) : (
          <p>{user.username}</p>
        )}
      </div>
    </div>
  )
}
