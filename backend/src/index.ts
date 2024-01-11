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
import { Server, Socket } from 'socket.io'

const app = express()
export const router = express.Router()
export let config: ReturnType<typeof getConfig>

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

let participantSocketMap: Record<string, Socket> = {}
let rooms: Record<string, {
  participants: Set<number>
}> = {}

function joinRoom(roomId: number, userId: number) {
  const room = rooms[roomId]
  if(room) {
    room.participants.add(userId)
    return
  }
  rooms[roomId] = {
    participants: new Set([userId])
  }
}

async function main() {
  try {
    const envVars = parseEnvVars()
    config = getConfig(envVars)
    await initDB(config)

    const httpServer = http.createServer(app)

    const io = new Server(httpServer, {
      cors: {
        origin: config.allowedOrigins,
        methods: ["GET", "POST"]
      }
    })

    // client established the bi-directional connection with the server
    io.on("connection", (socket) => {
      socket.on("PING", (data) => {
        console.log("ACTION: PING:", data)
        if(data.userId) {
          participantSocketMap[data.userId] = socket
        }
      })

      socket.on("JOIN_ROOM", (data) => {
        console.log("ACTION: JOIN_ROOM:", data)
        // TODO: validate the data using zod?
        joinRoom(data.roomId, data.userId)
        console.log("rooms after join:", rooms)
      })

      socket.on("ROOM_SEND_MESSAGE", (data) => {
        console.log("ACTION: ROOM_SEND_MESSAGE:", data)
        const room = rooms[data.roomId]
        if(!room) {
          console.error("error: no room found for roomId:", data.roomId)
          return
        }
        console.log("participants:", Object.keys(room.participants))
        room.participants.forEach(participant => {
          const socket = participantSocketMap[participant]
          if(!socket) {
            console.error("error: no socket found for participant:", participant)
          }
          socket.emit("ROOM_SEND_MESSAGE", data)
        })
      })
    })

    httpServer.listen(config.port, () => {
      console.log(`server started at port ${config.port}`)
    })
  } catch(err) {
    console.error("failed to initialize server:", err)
    process.exit(1)
  }
}

main()
