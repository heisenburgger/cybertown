import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useLogout } from "@/hooks/mutations";

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function ConfirmLogout(props: Props) {
  const { open, setOpen } = props
  const { mutate: logoutMutate } = useLogout()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            Before you press the continue button, think of your friends in cybertown
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded" onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction className="rounded" onClick={() => logoutMutate()}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
