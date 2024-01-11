import 'dotenv/config'
import express from 'express'
import { cors } from '@/middleware/cors'
import { errorHandler, notFoundHandler } from '@/lib/handler'
import { getConfig, parseEnvVars } from '@/config'
import { authRouter } from '@/modules/auth/route'
import { userRouter } from '@/modules/user/route'
import { roomRouter } from '@/modules/room/route'
import { initDB } from '@/db'
import cookieParser from 'cookie-parser'
import cookie from 'cookie'
import http from 'http'
import { Server } from 'socket.io'
import { registerRoomHandlers } from '@/socket/registerRoomHandler'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData, TServer, TSocket } from '@/types/socket'
import { validateTokens } from './lib/validateTokens'

const app = express()
export const router = express.Router()

// globals (sorry I still don't understand dependency injection)
export let config: ReturnType<typeof getConfig>
export let io: TServer

// middlewares
app.use(cors)
app.use(express.json())
app.use(cookieParser())

// routes
router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/rooms', roomRouter)
app.use('/v1', router)

app.use(notFoundHandler)
app.use(errorHandler)

async function main() {
  try {
    const envVars = parseEnvVars()
    config = getConfig(envVars)
    await initDB(config)
    const httpServer = http.createServer(app)
    io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
      cors: {
        origin: config.allowedOrigins,
        credentials: true,
        methods: ["GET", "POST"]
      }
    })
    io.use(async (socket: TSocket, next) => {
      const unauthorizedErr = new Error("Unauthorized")
      const cookieHeader = socket.handshake.headers.cookie
      if(!cookieHeader) {
        return next(unauthorizedErr)
      }
      const cookies = cookie.parse(cookieHeader)
      const payload = await validateTokens(cookies)
      socket.data.auth = payload
      if(!payload) {
        return next(unauthorizedErr)
      }
      next()
    })
    const onConnection = (socket: TSocket) => {
      registerRoomHandlers(io, socket)
    }
    io.on("connection", onConnection)
    httpServer.listen(config.port, () => {
      console.log(`server started at port ${config.port}`)
    })
  } catch (err) {
    console.error("failed to initialize server:", err)
    process.exit(1)
  }
}

main()
