import { api } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useUpdateRoomMetadata() {
  return useMutation({
    mutationFn: (data: {
      participantId: number,
      roomId: number,
      queryString: string,
    }) => {
      return api.updateRoomMetadata(data)
    }
  })
}
