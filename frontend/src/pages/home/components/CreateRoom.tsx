import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { useCreateRoom } from "@/hooks/queries/useCreateRoom"
import { useMe } from "@/hooks/queries"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

const newRoomSchema = z.object({
  topic: z.string().optional(),
  maxParticipants: z.string(),
  language: z.string().min(2, {
   message : "Please select language"
  })
})

export function CreateRoom(props: Props) {
  const { open, setOpen } = props
  const { mutateAsync: createRoomMutate, status } =  useCreateRoom()
  const loading = status === "pending"
  const { data: user } = useMe()

  const form = useForm<z.infer<typeof newRoomSchema>>({
    resolver: zodResolver(newRoomSchema),
    values: {
      topic: "",
      maxParticipants: "5",
      language: "",
    }
  })

  // TODO: show alert if this failed
  async function onSubmit(values: z.infer<typeof newRoomSchema>) {
    if(!user) {
      return
    }

    try {
      await createRoomMutate({
        ...values,
        maxParticipants: parseInt(values.maxParticipants),
        metadata: {
          owner: user.id,
          coOwners: [],
        }
      })
      setOpen(false)
    } catch(err) {
      console.error("error: failed to create room:", err)
    }
  }

  useEffect(() => {
    if(!open) {
      form.reset()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" forceMount>
        <DialogHeader className="mb-4">
          <DialogTitle>Create Room</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => {
                return <FormItem>
                  <FormLabel>Topic</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter topic"
                      className="px-2 py-2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              }}
            />
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => {
                  return <FormItem className="flex-1">
                    <FormLabel>Language</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="tamil">Tamil</SelectItem>
                        <SelectItem value="telugu">Telugu</SelectItem>
                        <SelectItem value="malayalam">Malayalam</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                }}
              />
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => {
                  return <FormItem className="flex-1">
                    <FormLabel>Maximum Participants</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4">4</SelectItem>
                        <SelectItem value="5">5</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                }}
              />
            </div>
            <DialogFooter className="mt-4">
              <Button disabled={loading} type="submit">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <span>Submit</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
