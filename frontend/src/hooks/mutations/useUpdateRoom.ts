import { api } from "@/lib/api";
import { UpdateRoom } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useUpdateRoom() {
  return useMutation({
    mutationFn: (data: {
      room: UpdateRoom, 
      roomId: number
    }) => {
      return api.updateRoom(data.room, data.roomId)
    }
  })
}
