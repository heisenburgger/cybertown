import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useRooms() {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: api.getRooms
  })
}
