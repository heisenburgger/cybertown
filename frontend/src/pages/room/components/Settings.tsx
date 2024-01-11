import { SocketRoom } from "@/types";
import { WelcomeMessage } from "./WelcomeMessage";

type Props = {
  room: SocketRoom
}

export function Settings(props: Props) {
  const { room } = props
  const welcomeMessage = room.metadata.welcomeMessage ?? ""

  return (
    <div className="h-full px-2 py-1">
      <WelcomeMessage welcomeMessage={welcomeMessage} room={room} />
    </div>
  )
}
