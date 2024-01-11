import { SocketRoom } from "@/types";
import { WelcomeMessage } from "./WelcomeMessage";
import { useMe } from "@/hooks/queries";

type Props = {
  room: SocketRoom
}

export function Settings(props: Props) {
  const { data: user } = useMe()
  const { room } = props
  const welcomeMessage = room.metadata.welcomeMessage ?? ""
  const isOwner = room.metadata.owner === user?.id
  const isCoOwner = room.metadata.coOwners?.includes(user?.id as number)

  return (
    <div className="h-full px-2 py-1">
      {(isOwner || isCoOwner) && (
        <WelcomeMessage welcomeMessage={welcomeMessage} room={room} />
      )}
    </div>
  )
}
