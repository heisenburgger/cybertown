import { useEffect, useRef } from "react"

export function AuthRedirect() {
  const messageSentRef = useRef(false)

  useEffect(() => {
    if(window.opener && !messageSentRef.current) {
      messageSentRef.current = true
      window.opener.postMessage({
        type: "REDIRECTED"
      })
      window.close()
    }
  }, [])

  return (
   <div className="h-full flex items-center justify-center">
      <p>Successfully logged in</p>
   </div>
  )
}
