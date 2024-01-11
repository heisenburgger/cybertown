import { TSocket } from '@/types/socket'
import { ExtendedError } from 'socket.io/dist/namespace'
import { validateTokens } from '@/lib/validateTokens'
import cookie from 'cookie'

type NextFunction = (err?: ExtendedError) => void

export async function isSocketAuthenticated(socket: TSocket, next: NextFunction) {
  const unauthorizedErr = new Error("Unauthorized")
  const cookieHeader = socket.handshake.headers.cookie
  if(!cookieHeader) {
    return next(unauthorizedErr)
  }
  const cookies = cookie.parse(cookieHeader)
  const payload = await validateTokens(cookies)
  socket.data.auth = payload
  socket.data.mediasoup = {
    sendTransport: null,
    recvTransport: null,
    producer: null,
    consumers: [],
  }
  if(!payload) {
    return next(unauthorizedErr)
  }
  next()
}
