import { z } from 'zod'
import { envSchema } from "./utils"

export function parseEnvVars() {
  const parsedEnv = envSchema.safeParse(process.env)
  if(!parsedEnv.success) {
    const missingVars = parsedEnv.error.issues.map(el => el.path).join(', ')
    throw new Error(`missing env vars: ${missingVars}`)
  }
  return parsedEnv.data
}

export function getConfig(envVars: z.infer<typeof envSchema>) {
  return {
    google: {
      redirectURL: envVars.GOOGLE_CALLBACK_URL,
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    },
    postgreDSN: envVars.POSTGRES_DSN,
    jwt: {
      secret: envVars.JWT_SECRET,
      accessTokenExpiry: envVars.JWT_ACCESS_TOKEN_EXPIRY,
      refreshTokenExpiry: envVars.JWT_REFRESH_TOKEN_EXPIRY,
    },
    allowedOrigins: envVars.ALLOWED_ORIGINS,
    port: envVars.PORT,
    domain: envVars.DOMAIN,
  }
}

export type Config = ReturnType<typeof getConfig>
