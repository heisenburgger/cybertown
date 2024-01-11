import { api } from "@/lib";
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
