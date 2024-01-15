import { EnvSchema, envSchema } from "@/lib/validation"

export function parseEnvVars() {
  const parsedEnv = envSchema.safeParse(process.env)
  if(!parsedEnv.success) {
    const missingVars = parsedEnv.error.issues.map(el => el.path).join(', ')
    throw new Error(`missing or invalid env vars: ${missingVars}`)
  }
  return parsedEnv.data
}

export function getConfig(envVars: EnvSchema) {
  return {
    google: {
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
    },
    postgres: {
      host: envVars.POSTGRES_HOST,
      port: envVars.POSTGRES_PORT,
      user: envVars.POSTGRES_USER,
      password: envVars.POSTGRES_PASSWORD,
      db: envVars.POSTGRES_DB,
    },
    jwt: {
      secret: envVars.JWT_SECRET,
      accessTokenExpiry: envVars.JWT_ACCESS_TOKEN_EXPIRY,
      refreshTokenExpiry: envVars.JWT_REFRESH_TOKEN_EXPIRY,
    },
    mediasoupListenIP: envVars.MEDIASOUP_LISTEN_IP,
    allowedOrigins: envVars.ALLOWED_ORIGINS,
    port: envVars.PORT,
    webRedirectURL: envVars.WEB_REDIRECT_URL,
    roomIdPrefix: envVars.ROOM_ID_PREFIX,
  }
}

export type Config = ReturnType<typeof getConfig>
