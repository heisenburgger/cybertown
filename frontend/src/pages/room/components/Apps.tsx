import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRef } from "react";
import { appMediasoup } from "@/lib/AppMediasoup";
import { appSocket } from "@/lib/socket/AppSocket";
import { useRoomStore } from "@/stores";
import { useMe } from "@/hooks/queries";

type Props = {
  roomId: number
}

export function Apps(props: Props) {
  const { data: user } = useMe()
  const { roomId } = props
  const trackRef = useRef<MediaStreamTrack | null>(null)
  const isScreensharing = useRoomStore(state => {
    // am I sharing my screen?
    const me = state.participants[user?.id as number]
    return me?.producers.findIndex(producer => producer.roomKind === 'screenshare') !== -1
  })

  async function getTrack() {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        audio: false,
        video: true
      })
      return stream.getVideoTracks()[0]
    } catch(err) {
      throw err
    }
  }

  async function shareScreen() {
    try {
      const track = await getTrack()
      const videoEl = document.getElementById("screenShareStream")
      if(!videoEl) {
        throw new Error("Missing video element")
      }
      if(videoEl instanceof HTMLVideoElement) {
        trackRef.current = track
        videoEl.srcObject = new MediaStream([track])
        track.onended = stopScreenshare
      }
      appMediasoup.produce(track, 'screenshare')
    } catch(err) {
      console.log("error: shareScreen:", err)
      if(err instanceof Error) {
        toast.error(err.message)
      }
    }
  }

  function stopScreenshare() {
    if(trackRef.current) {
      trackRef.current.stop()
      appSocket.stopProducing({
        roomId,
        roomKind: 'screenshare'
      })
      appMediasoup.stopProducing('screenshare')
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      {!isScreensharing && <Button variant="outline" onClick={shareScreen}>Share Screen</Button>}
      {isScreensharing && <Button variant="destructive" onClick={stopScreenshare}>Stop Screen Sharing</Button>}
    </div>
  )
}
