import { EnvSchema } from '@/utils/validation'

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchema {}
  }
}
