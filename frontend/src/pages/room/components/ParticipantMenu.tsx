import { Settings, ShieldIcon, BanIcon, VenetianMask } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoeIcon } from "@/icons";
import { ProfileUser, SocketRoom } from "@/types";
import { toast } from "sonner";
import { useUpdateRoomMetadata } from "@/hooks/mutations";

type Props = {
  room: SocketRoom
  participant: ProfileUser
}

export function ParticipantMenu(props: Props) {
  const { room, participant } = props
  const isCoOwner = room.metadata.coOwners?.includes(participant.id)
  const { mutateAsync: updateRoomMetadataMutate } = useUpdateRoomMetadata()

  async function setCoOwnership(unset = false) {
    try {
      updateRoomMetadataMutate({
        queryString: `coOwner=${unset ? 0 : 1}`,
        roomId: room.id,
        participantId: participant.id,
      })
    } catch(err) {
      console.log("error: failed to set co-owner:", err)
      if(err instanceof Error) {
        toast.error(err.message)
      }
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute top-0 right-0 bg-primary/40 p-1 rounded-bl-xl group-hover:bg-primary/80">
        <Settings strokeWidth="1" size="12" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="top">
        <DropdownMenuItem className="flex gap-2 items-center" onClick={() => {
          // unsets the co-ownership if the participant is co-owner
          setCoOwnership(isCoOwner)
        }}>
          <ShieldIcon stroke="#94a3b8" strokeWidth="1" size="16" />
          <p>{isCoOwner ? 'Unset' : 'Set'} Co-Owner</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2 items-center">
          <BanIcon stroke="#94a3b8" strokeWidth="1" size="16" />
          <p>Clear Chat</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2 items-center">
          <ShoeIcon stroke="#94a3b8" height="18" width="18" />
          <p>Kick</p>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2 items-center">
          <VenetianMask stroke="#94a3b8" strokeWidth="1" size="18" />
          <p>PM</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
