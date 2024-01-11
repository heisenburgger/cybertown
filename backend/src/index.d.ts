import { EnvSchema } from './utils'

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchema {}
  }
}

declare module 'express' {
  interface Response {
    locals: {
      userId: number
      sessionId: number
    };
  }
}
