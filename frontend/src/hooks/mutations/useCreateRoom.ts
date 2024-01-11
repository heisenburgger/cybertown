import { api } from "@/lib/api";
import { CreateRoom } from "@/pages/home/components";
import { useMutation } from "@tanstack/react-query";

export function useCreateRoom() {
  return useMutation({
    mutationFn: (room: CreateRoom) => api.createRoom(room),
  })
}
