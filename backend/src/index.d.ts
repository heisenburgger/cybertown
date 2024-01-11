import { z } from 'zod'
import { envSchema } from '@/utils'

export type EnvSchemaType = z.infer<typeof envSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchemaType {}
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
