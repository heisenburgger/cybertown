import { api } from "@/lib/api";
import { TCreateRoom } from "@/pages/home/components";
import { useMutation } from "@tanstack/react-query";

export function useCreateRoom() {
  return useMutation({
    mutationFn: (room: TCreateRoom) => api.createRoom(room),
  })
}
