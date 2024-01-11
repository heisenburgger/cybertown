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
import { useCreateRoom, useUpdateRoom } from "@/hooks/mutations"
import { useMe } from "@/hooks/queries"
import { toast } from "sonner"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  children?: React.ReactNode
  // for updating a room
  defaultValues?: CreateRoomValues
  roomId?: number
  mode?: "create" | "edit"
}

const createRoomSchema = z.object({
  topic: z.string().optional(),
  maxParticipants: z.string(),
  language: z.string().min(2, {
   message : "Please select language"
  })
})


// CreateRoom creates or updates an existing room
export function CreateRoom(props: Props) {
  const { open, setOpen, children, mode = "create", defaultValues, roomId } = props
  const { mutateAsync: createRoomMutate, status: createStatus } =  useCreateRoom()
  const { mutateAsync: updateRoomMutate, status: updateStatus } =  useUpdateRoom()
  const loading = createStatus === "pending" || updateStatus === "pending"
  const { data: user } = useMe()

  const form = useForm<z.infer<typeof createRoomSchema>>({
    resolver: zodResolver(createRoomSchema),
    values: defaultValues ?? {
      topic: "",
      maxParticipants: "5",
      language: "",
    }
  })

  async function onSubmit(values: z.infer<typeof createRoomSchema>) {
    if(!user) {
      return
    }
    try {
      if(mode === 'create') {
        await createRoomMutate({
          ...values,
          maxParticipants: parseInt(values.maxParticipants),
        })
      }
      if(mode === 'edit' && roomId) {
        await updateRoomMutate({
          roomId,
          room: {
            ...values,
            maxParticipants: parseInt(values.maxParticipants),
          }
        })
      }
      setOpen(false)
    } catch(err) {
      console.error(`error: failed to ${mode} room:`, err)
      toast.error(`Failed to ${mode} room`)
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
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" forceMount>
        <DialogHeader className="mb-4">
          <DialogTitle>
            {mode === 'create' ? 'Create' : 'Edit'} Room
          </DialogTitle>
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

type CreateRoomValues = z.infer<typeof createRoomSchema>
export type TCreateRoom = Omit<CreateRoomValues, 'maxParticipants'> & {
  maxParticipants: number
}
