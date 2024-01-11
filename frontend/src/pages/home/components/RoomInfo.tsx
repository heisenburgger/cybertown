import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GearIcon } from "@/icons";
import { cn, getAvatarFallback, getDateTime } from "@/lib/utils";
import { SocketRoom } from "@/types";
import { Calendar, Pencil } from "lucide-react";
import { useState } from "react";
import { CreateRoom } from '@/pages/home/components'
import { useMe } from "@/hooks/queries";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Props = {
  room: SocketRoom
}

export function RoomInfo(props: Props) {
  const { data: user } = useMe()
  const { createdBy, language, maxParticipants, topic, id, metadata, createdAt } = props.room
  const [popupOpen, setPopupOpen] = useState(false)
  const [roomOpen, setRoomOpen] = useState(false)

  return (
    <>
      <Popover open={popupOpen} onOpenChange={setPopupOpen}>
        <PopoverTrigger>
          <GearIcon stroke="#94a3b8" />
        </PopoverTrigger>
        <PopoverContent onOpenAutoFocus={e => e.preventDefault()} className="w-auto flex flex-col p-4 p-0 min-h-[100px] justify-center">
          <div className={cn("flex flex-col gap-3 px-4 py-3", {
            'border-b': metadata.owner === user?.id
          })}>
            <div className="flex items-center gap-3">
              <Avatar className="rounded-full h-12 w-12">
                <AvatarImage src={createdBy.avatar} alt={createdBy.username} />
                <AvatarFallback>{getAvatarFallback(createdBy.username)}</AvatarFallback>
              </Avatar>
              <div>
                <p>{createdBy.username}</p>
                <p className="text-muted-foreground text-xs">creator</p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Calendar strokeWidth="1" size="15" stroke="#94a3b8" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Created At</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-muted-foreground text-xs relative top-[1px]">{getDateTime(createdAt)}</p>
            </div>
          </div>
          {metadata.owner === user?.id && (
            <div className="flex gap-4 items-center px-4 py-3" role="button" onClick={() => {
              setPopupOpen(false)
              setRoomOpen(true)
            }}>
              <Pencil strokeWidth="1" size="16" />
              <span>Edit Room</span>
            </div>
          )}
        </PopoverContent>
      </Popover>
      <CreateRoom roomId={id} mode="edit" open={roomOpen} setOpen={setRoomOpen} defaultValues={{
        language,
        maxParticipants: maxParticipants.toString(),
        topic: topic ?? ""
      }} />
    </>
  )
}
