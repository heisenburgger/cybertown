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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useCreateRoom } from "@/hooks/queries/useCreateRoom"
import { useMe } from "@/hooks/queries"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function CreateRoom(props: Props) {
  const { data: user } = useMe()
  const { mutate: createRoomMutate } = useCreateRoom()
  const { open, setOpen } = props
  const [topic, setTopic] = useState("")
  const [language, setLanguage] = useState("")
  const [maxParticipants, setMaxParticipants] = useState("")

  function createRoom() {
    if(!user) {
      return
    }
    createRoomMutate({
      topic,
      language,
      maxParticipants: parseInt(maxParticipants),
      metadata: {
        owner: user.id,
        coOwners: [],
      }
    })
    setLanguage("")
    setTopic("")
    setMaxParticipants("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-4">
          <DialogTitle>Create Room</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="topic">
              Topic
            </Label>
            <Input
              value={topic}
              onChange={e => setTopic(e.currentTarget.value)}
              id="topic"
              className="px-2 py-2"
            />
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="language">
                Language
              </Label>
              <Select value={language} onValueChange={value => setLanguage(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="hindi">Hindi</SelectItem>
                    <SelectItem value="tamil">Tamil</SelectItem>
                    <SelectItem value="telugu">Telugu</SelectItem>
                    <SelectItem value="malayalam">Malayalam</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="participants">
                Maximum Participants
              </Label>
              <Select value={maxParticipants} onValueChange={value => setMaxParticipants(value)}>
                <SelectTrigger id="participants">
                  <SelectValue placeholder="Max Participants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={createRoom} type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
