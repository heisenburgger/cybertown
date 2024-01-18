import { useRoomStore } from "@/stores";
import { appMediasoup } from "../AppMediasoup";
import { TransportOptions, TransportDirection, ConsumeStopPayload } from '@/types'
import { ParticipantState } from '@/types'

export const mediasoupHandler = {
  transportOptions(data: Record<TransportDirection, TransportOptions>) {
    console.log("transportOptions:", data)
    appMediasoup.createTransports(data)
  },

  stopConsuming(data: ConsumeStopPayload) {
    console.log("stopConsuming:", data)
    if(data.roomKind === 'screenshare-video') {
      const videoEl = document.getElementById("screenShareStreamVideo")
      if(videoEl instanceof HTMLVideoElement) {
        videoEl.srcObject = null
      }
    }
    if(data.roomKind === 'screenshare-video') {
      const audioEl = document.getElementById("screenShareStreamAudio")
      if(audioEl instanceof HTMLAudioElement) {
        audioEl.srcObject = null
      }
    }
    appMediasoup.stopConsuming(data.roomKind)
  },

  mediasoupState(state: Record<number, ParticipantState>) {
    console.log("mediasoupState:", state)
    useRoomStore.setState({
      participants: state
    })
  },
};
