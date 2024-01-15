import { config as dotenvConfig } from 'dotenv'
import express from 'express'
import { cors } from '@/middleware/cors'
import { errorHandler, notFoundHandler } from '@/lib/handler'
import { getConfig, parseEnvVars } from '@/config'
import { authRouter } from '@/modules/auth/route'
import { userRouter } from '@/modules/user/route'
import { roomRouter } from '@/modules/room/route'
import { initDB } from '@/db'
import cookieParser from 'cookie-parser'
import http from 'http'
import { Server } from 'socket.io'
import { registerRoomHandlers } from '@/socket/registerRoomHandlers'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData, TServer, TSocket } from '@/types/socket'
import { isSocketAuthenticated } from '@/middleware'
import { AppMediasoup } from './mediasoup/AppMediasoup'
import { registerMediasoupHandler } from './socket/registerMediasoupHandlers'

dotenvConfig({ path: '../.env' })

const app = express()
export const router = express.Router()

// globals (sorry I still don't understand dependency injection)
export let config: ReturnType<typeof getConfig>
export let io: TServer
export let appMediasoup = new AppMediasoup()

// middlewares
app.use(cors)
app.use(express.json())
app.use(cookieParser())

// routes
router.use('/auth', authRouter)
router.use('/users', userRouter)
router.use('/rooms', roomRouter)
app.use('/api/v1', router)

app.use(notFoundHandler)
app.use(errorHandler)

async function main() {
  try {
    const envVars = parseEnvVars()
    config = getConfig(envVars)
    await initDB(config)
    await appMediasoup.createWorkers()
    const httpServer = http.createServer(app)
    io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer, {
      cors: {
        origin: config.allowedOrigins,
        credentials: true,
        methods: ["GET", "POST"]
      }
    })
    io.use(isSocketAuthenticated)
    const onConnection = (socket: TSocket) => {
      registerRoomHandlers(io, socket)
      registerMediasoupHandler(io, socket)
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
