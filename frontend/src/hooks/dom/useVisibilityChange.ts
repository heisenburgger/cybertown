import { config } from "@/config";
import { useRoomStore } from "@/stores";
import { SocketRoom } from "@/types";
import { useEffect } from "react";

export function updateTitle(content: string) {
  const elements = Array.from(document.getElementsByTagName("title"))
  if(!elements.length) {
    return
  }
  const title = elements[0]
  if(title) {
    title.innerHTML = content
  }
}

export function useVisibilityChange(room: SocketRoom | undefined) {
  const setUnreadMessagesFor = useRoomStore(state => state.setUnreadMessagesFor)
  useEffect(() => {
    function onVisibilityChange() {
      if(!document.hidden) {
        setUnreadMessagesFor('tabInactive', 0)
        updateTitle(`${config.siteTitle} | ${room?.topic}`)
      } 
    }
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [room])
}
