import { config } from "@/config"
import { fetchios } from "."
import { User, NewRoom } from "@/types"

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

  async createRoom(room: NewRoom) {
    const url = config.apiURL + "/rooms"
    const data = await fetchios<"roomId", number>(url, {
      method: "POST",
      body: JSON.stringify(room)
    })
    return data?.roomId ?? null
  }
}
