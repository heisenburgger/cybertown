import { createBrowserRouter } from "react-router-dom"
import { Home } from "@/pages/home"
import { Profile } from "@/pages/profile"
import { AuthRedirect } from "@/pages/auth-redirect"
import { Room } from "@/pages/room"

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/auth-redirect", element: <AuthRedirect /> },
  { path: "/profile", element: <Profile /> },
  { path: "/rooms/:roomId", element: <Room /> },
])
