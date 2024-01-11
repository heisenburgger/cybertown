import { config } from "@/config"
import { fetchios } from "@/lib/fetchios"
import { SocketRoom, User } from "@/types"
import { CreateRoom } from '@/pages/home/components'

export const api = {
  async whoAmI() {
    const url = config.apiURL + "/users/me"
    const data = await fetchios<"user", User>(url)
    return data?.user ?? null
  },

  async logOut() {
    const url = config.apiURL + "/auth/logout"
    const data = await fetchios<"message", string>(url, {
      method: "DELETE"
    })
    return data?.message ?? null
  },

  async createRoom(room: CreateRoom) {
    const url = config.apiURL + "/rooms"
    const data = await fetchios<"roomId", number>(url, {
      method: "POST",
      body: JSON.stringify(room)
    })
    return data?.roomId ?? null
  },

  async getRooms() {
    const url = config.apiURL + "/rooms"
    const data = await fetchios<"rooms", SocketRoom[]>(url)
    return data?.rooms ?? null
  },
}
