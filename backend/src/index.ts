import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import { cors } from '@/middleware'
import { errorHandler, notFoundHandler } from '@/utils'
import { getConfig, parseEnvVars } from '@/config'
import { authRouter } from '@/auth'
import { userRouter } from '@/user'
import { initDB } from '@/db'

const app = express()
export const router = express.Router()
export let config: ReturnType<typeof getConfig>

// middlewares
app.use(cors)
app.use(cookieParser())

// routes
router.use('/auth', authRouter)
router.use('/users', userRouter)
app.use('/v1', router)

app.use(notFoundHandler)
app.use(errorHandler)

async function main() {
  try {
    const envVars = parseEnvVars()
    config = getConfig(envVars)
    await initDB(config)
    app.listen(config.port, () => {
      console.log(`server started at port ${config.port}`)
    })
  } catch(err) {
    console.error("failed to initialize server:", err)
    process.exit(1)
  }
}

main()
