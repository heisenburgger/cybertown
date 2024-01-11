import { api } from "@/lib/api";
import { useMutation, useQueryClient} from "@tanstack/react-query";

export function useLogout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => {
      return api.logOut()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["me"]
      })
    }
  })
}
