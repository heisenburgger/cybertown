import { api } from "@/lib";
import { NewRoom } from "@/types";
import { useMutation } from "@tanstack/react-query";

export function useCreateRoom() {
  return useMutation({
    mutationFn: (room: NewRoom) => api.createRoom(room),
  })
}
