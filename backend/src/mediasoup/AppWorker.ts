import * as mediasoup from 'mediasoup'
import { WorkerRouter } from '@/types/mediasoup'
import os from 'os'
import { mediasoupConfig as config } from './config'

class AppWorker {
  workerRouters: WorkerRouter[] = []
  workerRoutersIdx = 0
  roomWorkerRouterMap: Record<string, WorkerRouter> = {}

  async create() {
    const workerRouters: WorkerRouter[] = []
    const numOfCPUs = os.cpus().length
    for (let i = 0; i < numOfCPUs; i++) {
      const worker = await mediasoup.createWorker({
        logLevel: config.mediasoup.worker.logLevel,
        logTags: config.mediasoup.worker.logTags,
        rtcMinPort: config.mediasoup.worker.rtcMinPort,
        rtcMaxPort: config.mediasoup.worker.rtcMaxPort,
      })
      const mediaCodecs = config.mediasoup.router.mediaCodecs;
      const router = await worker.createRouter({
        mediaCodecs,
      })
      worker.on("died", () => {
        console.log("error: worker died:", worker.pid)
        process.exit(1)
      })
      workerRouters.push({ worker, router })
    }
    this.workerRouters = workerRouters
  }

  assignWorkerRouterToRoom(roomId: string) {
    const workerRouter = this.workerRouters[this.workerRoutersIdx]
    this.workerRoutersIdx++
    this.workerRoutersIdx %= this.workerRouters.length
    this.roomWorkerRouterMap[roomId] = workerRouter
  }

  getWorkerRouter(roomId: string) {
    return this.roomWorkerRouterMap[roomId]
  }
}

export const appWorker = new AppWorker()
