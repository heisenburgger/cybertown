import { RoomParticipantState, useRoomStore } from "@/stores";
import { appMediasoup } from "../AppMediasoup";
import { TransportOptions, TransportDirection, ConsumeStopPayload } from '@/types'

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
    appMediasoup.stopConsuming(data.roomKind)
  },

  mediasoupState(state: Record<number, RoomParticipantState>) {
    console.log("mediasoupState:", state)
    const roomState = useRoomStore.getState()
    useRoomStore.setState({
      ...roomState,
      participants: state
    })
  },
};
