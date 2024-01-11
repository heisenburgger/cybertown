import { api } from "@/lib";
import { useQuery } from "@tanstack/react-query";

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: api.getRooms
  })
}
