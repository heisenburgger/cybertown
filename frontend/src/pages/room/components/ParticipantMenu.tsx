import { Settings, ShieldIcon, BanIcon, VenetianMask, KeyIcon } from "lucide-react";
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
import { useMe } from "@/hooks/queries";
import { appSocket } from "@/lib/socket/AppSocket";
import { useRoomStore } from "@/stores";

type Props = {
  room: SocketRoom
  participant: ProfileUser
}

export function ParticipantMenu(props: Props) {
  const { data: user } = useMe()
  const { room, participant } = props
  const { mutateAsync: updateRoomMetadataMutate } = useUpdateRoomMetadata()

  const isWidgetExpanded =  useRoomStore(state => state.widgetMode === 'expanded')
  const setWidgetMode =  useRoomStore(state => state.setWidgetMode)
  const setInPMWith = useRoomStore(state => state.setInPMWith)

  const isPartcipantCoOwner = room.metadata.coOwners?.includes(participant.id)
  const isParticipantOwner = room.metadata.owner === participant.id

  const isOwner = user?.id === room.metadata.owner
  const isCoOwner = user?.id === room.metadata.coOwners?.includes(user?.id as number)

  const hasPermissions = (isOwner || isCoOwner) && !isParticipantOwner

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

  async function clearChat() {
    appSocket.clearChat({
      participantId: participant.id,
      roomId: room.id,
    })
  }

  function putInPM() {
    setWidgetMode("expanded")
    // the classic fix
    setTimeout(() => {
      const textareaEl = document.getElementById("sendMessage")
      if(textareaEl instanceof HTMLTextAreaElement) {
        textareaEl.focus()
        setInPMWith(participant)
      }
    }, isWidgetExpanded ? 0 : 400)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="absolute top-0 right-0 bg-primary/40 p-1 rounded-bl-xl group-hover:bg-primary/80">
        <Settings strokeWidth="1" size="12" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="top flex flex-col justify-center gap-2 p-2" onCloseAutoFocus={e => e.preventDefault()}>
        {hasPermissions && (
          <>
            <DropdownMenuItem className="flex gap-2 items-center" onClick={() => {
              // unsets the co-ownership if the participant is co-owner
              setCoOwnership(isPartcipantCoOwner)
            }}>
              <ShieldIcon stroke="#94a3b8" strokeWidth="1" size="16" />
              <p>{isPartcipantCoOwner ? 'Unset' : 'Set'} Co-Owner</p>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex gap-2 items-center" onClick={clearChat}>
              <BanIcon stroke="#94a3b8" strokeWidth="1" size="16" />
               <p>Clear Chat</p>
            </DropdownMenuItem>
           <DropdownMenuItem className="flex gap-2 items-center">
              <ShoeIcon stroke="#94a3b8" height="18" width="18" />
              <p>Kick</p>
            </DropdownMenuItem>
          </>
        )}
        {isOwner && (
          <DropdownMenuItem className="flex gap-2 items-center">
            <KeyIcon stroke="#94a3b8" height="16" width="16" />
            <p>Transfer Room</p>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem className="flex gap-2 items-center" onClick={putInPM}>
          <VenetianMask stroke="#94a3b8" strokeWidth="1" size="18" />
          <p>PM</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
