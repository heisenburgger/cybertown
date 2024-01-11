import { Button } from "@/components/ui/button";
import { SetState } from "..";
import { toast } from "sonner";
import { useRef } from "react";
import { appMediasoup } from "@/lib/AppMediasoup";

type Props = {
  isScreenSharing: boolean
  setIsScreenSharing: SetState<boolean>
}

export function Apps(props: Props) {
  const { isScreenSharing, setIsScreenSharing } = props
  const trackRef = useRef<MediaStreamTrack | null>(null)

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
        track.onended = function() {
          setIsScreenSharing(false)
        }
      }
      appMediasoup.produce(track)
      setIsScreenSharing(true)
    } catch(err) {
      console.log("error: shareScreen:", err)
      if(err instanceof Error) {
        toast.error(err.message)
      }
    }
    // set to video element
    // publish track
  }

  function stopScreenshare() {
    if(trackRef.current) {
      trackRef.current.stop()
      setIsScreenSharing(false)
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      {!isScreenSharing && <Button variant="outline" onClick={shareScreen}>Share Screen</Button>}
      {isScreenSharing && <Button variant="destructive" onClick={stopScreenshare}>Stop Screen Sharing</Button>}
    </div>
  )
}
