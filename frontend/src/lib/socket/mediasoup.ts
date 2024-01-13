import { useRoomStore } from "@/stores";
import { appMediasoup } from "../AppMediasoup";
import { TransportOptions, TransportDirection, ConsumeStopPayload, User } from '@/types'
import { queryClient } from "../queryClient";

export const mediasoupHandler = {
  transportOptions(data: Record<TransportDirection, TransportOptions>) {
    console.log("transportOptions:", data)
    appMediasoup.createTransports(data)
  },

  stopConsuming(data: ConsumeStopPayload) {
    console.log("stopConsuming:", data)

    if(data.roomKind === 'screenshare') {
      const videoEl = document.getElementById("screenShareStream")
      if(videoEl instanceof HTMLVideoElement) {
        videoEl.srcObject = null
      }
    }

		const user: User | undefined = queryClient.getQueryData(['me']);
    if(user) {
      const roomState = useRoomStore.getState()
      useRoomStore.setState({
        ...roomState,
        participants: {
         ...roomState.participants,
          [user.id]: {
           ...roomState.participants[user.id],
            consuming: false
          }
        }
      })
    }

    appMediasoup.stopConsuming(data.roomKind)
  }
};
