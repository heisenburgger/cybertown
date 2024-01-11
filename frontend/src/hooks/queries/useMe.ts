import { api } from "@/lib";
import { useQuery } from "@tanstack/react-query";

export function useMe() {
  return useQuery({
    queryKey: ['me'],
    queryFn: api.whoAmI
  })
}
