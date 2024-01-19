import { useEffect, useRef } from "react"
import { Helmet } from 'react-helmet'

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
      <Helmet>
        <title>Auth Redirect</title>
      </Helmet>
      <p>Successfully logged in</p>
   </div>
  )
}
