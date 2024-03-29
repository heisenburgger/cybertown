import { config } from "@/config"
import { fetchWrapper } from "@/lib/fetchWrapper"
import { SocketRoom, User, UpdateRoom, Room } from "@/types"
import { TCreateRoom } from '@/pages/home/components'

export const api = {
  async whoAmI() {
    const url = config.apiURL + "/users/me"
    const data = await fetchWrapper<"user", User>(url)
    return data.user
  },

  async logOut() {
    const url = config.apiURL + "/auth/logout"
    const data = await fetchWrapper<"message", string>(url, {
      method: "DELETE"
    })
    return data.message
  },

  async createRoom(room: TCreateRoom) {
    const url = config.apiURL + "/rooms"
    const data = await fetchWrapper<"roomId", number>(url, {
      method: "POST",
      body: JSON.stringify(room)
    })
    return data.roomId
  },

  async getRooms() {
    const url = config.apiURL + "/rooms"
    const data = await fetchWrapper<"rooms", SocketRoom[]>(url)
    return data.rooms
  },

  async updateRoom(room: UpdateRoom, roomId: number) {
    const url = config.apiURL + `/rooms/${roomId}`
    const data = await fetchWrapper<"room", Room[]>(url, {
      method: "PUT",
      body: JSON.stringify(room),
    })
    return data.room
  },

  async updateRoomMetadata(input: {
     participantId: number,
     roomId: number,
     queryString: string,
  }) {
    const { participantId, roomId, queryString } = input
    const url = config.apiURL + `/rooms/${roomId}/metadata?${queryString}`
    const data = await fetchWrapper<"event", any>(url, {
      method: "PUT",
      body: JSON.stringify({
        participantId
      }),
    })
    return data.event
  },
}
