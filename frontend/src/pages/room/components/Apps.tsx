import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRef } from "react";
import { appMediasoup } from "@/lib/AppMediasoup";
import { appSocket } from "@/lib/socket/AppSocket";
import { useRoomStore } from "@/stores";
import { useMe } from "@/hooks/queries";
import { useShallow } from 'zustand/react/shallow'

type Props = {
  roomId: number
}

export function Apps(props: Props) {
  const { data: user } = useMe()
  const { roomId } = props
  const streamRef = useRef<{
    audio: MediaStreamTrack
    video: MediaStreamTrack
  } | null>(null)
  const isScreensharing = useRoomStore(useShallow(state => {
    const me = state.participants[user?.id as number]
    return !!me?.producers.find(producer => producer.roomKind === 'screenshare-video')
  }))

  async function getStream() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      audio: true,
      video: {
        // no idea what this is 
        frameRate: 10
      }
    })
    return stream
  }

  async function shareScreen() {
    try {
      const stream = await getStream()
      const videoEl = document.getElementById("screenShareStreamVideo")
      const audioEl = document.getElementById("screenShareStreamAudio")
      if(!videoEl || !audioEl) {
        throw new Error("Missing video or audio element")
      }
      if(videoEl instanceof HTMLVideoElement && audioEl instanceof HTMLAudioElement) {
        const audioTrack = stream.getAudioTracks()[0]
        const videoTrack = stream.getVideoTracks()[0]
        streamRef.current = {
          audio: audioTrack,
          video: videoTrack
        }
        videoEl.srcObject = new MediaStream([videoTrack])
        videoTrack.onended = stopScreenshare
        audioEl.srcObject = new MediaStream([videoTrack])
        appMediasoup.produce(videoTrack, 'screenshare-video')
        if(audioTrack) {
          appMediasoup.produce(audioTrack, 'screenshare-audio')
        }
      }
    } catch(err) {
      console.log("error: shareScreen:", err)
      if(err instanceof Error) {
        toast.error(err.message)
      }
    }
  }

  function stopScreenshare() {
    if(streamRef.current) {
      streamRef.current.audio?.stop()
      streamRef.current.video?.stop()
      appMediasoup.stopScreenshare(roomId)
    }
  }

  return (
    <div className="h-full flex items-center justify-center">
      {!isScreensharing && <Button variant="outline" onClick={shareScreen}>Share Screen</Button>}
      {isScreensharing && <Button variant="destructive" onClick={stopScreenshare}>Stop Screen Sharing</Button>}
    </div>
  )
}
