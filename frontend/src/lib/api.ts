import { config } from "@/config"
import { fetchios } from "."
import { User } from "@/types"

export const api = {
  async whoAmI() {
    try {
      const data = await fetchios<"user", User>(config.apiURL + "/users/me")
      return data.user
    } catch(err) {
      throw err
    }
  }
}
