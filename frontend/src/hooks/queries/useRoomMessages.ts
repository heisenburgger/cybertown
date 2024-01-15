import { RoomEvent } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useRoomEvents(roomId: number) {
  return useQuery<RoomEvent[]>({
    queryKey: ['room:events', roomId],
    queryFn: () => [],
    refetchOnWindowFocus: false,
  })
}
