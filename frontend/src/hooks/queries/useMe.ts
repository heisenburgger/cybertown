import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: api.whoAmI
  })
}
