import 'dotenv/config'
import express from 'express'
import { cors } from '@/middleware'
import { errorHandler, notFoundHandler } from '@/utils'
import { getConfig, parseEnvVars } from '@/config'
import { authRouter } from '@/auth'
import { userRouter } from '@/user'
import { roomRouter } from '@/room'
import { initDB } from '@/db'
import cookieParser from 'cookie-parser'
import http from 'http'
import { Server } from 'socket.io'
import { registerRoomHandlers } from './socket/registerRoomHandler'
import { ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData, TServer, TSocket } from './socket/types'

const app = express()
export const router = express.Router()
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
        methods: ["GET", "POST"]
      }
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
