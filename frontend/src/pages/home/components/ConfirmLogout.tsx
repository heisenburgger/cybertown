import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { config } from "@/config";
import { useLogout } from "@/hooks/mutations";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function ConfirmLogout(props: Props) {
  const { open, setOpen } = props
  const { mutateAsync: logoutMutate, status } = useLogout()
  const loading = status === "pending"

  async function handleConfirm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    try  {
      logoutMutate()
      setOpen(false)
    } catch(err) {
      console.log("error: failed to log out:", err)
      toast.error("Logout failed")
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            Before you press the continue button, think of your friends in {config.siteTitle}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded" onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} className="rounded" onClick={handleConfirm}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <span>Continue</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
