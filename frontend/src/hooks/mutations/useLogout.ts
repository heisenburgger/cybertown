import { api } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

export function useLogout() {
  return useMutation({
    mutationFn: api.logOut,
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ['me']
      })
    }
  })
}
