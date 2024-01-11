import { config } from "@/config"
import { fetchios } from "."
import { User } from "@/types"

export const api = {
  async whoAmI() {
    const url = config.apiURL + "/users/me"
    const data = await fetchios<"user", User>(url)
    return data?.user ?? null
  },

  async logOut() {
    const url = config.apiURL + "/auth/logout"
    const data = await fetchios<"message", unknown>(url, {
      method: "DELETE"
    })
    return data?.message ?? null
  }
}
