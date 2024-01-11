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
    postgresDSN: envVars.POSTGRES_DSN,
    jwt: {
      secret: envVars.JWT_SECRET,
      accessTokenExpiry: envVars.JWT_ACCESS_TOKEN_EXPIRY,
      refreshTokenExpiry: envVars.JWT_REFRESH_TOKEN_EXPIRY,
    },
    allowedOrigins: envVars.ALLOWED_ORIGINS,
    port: envVars.PORT,
    webRedirectURL: envVars.WEB_REDIRECT_URL,
    roomIdPrefix: envVars.ROOM_ID_PREFIX,
  }
}

export type Config = ReturnType<typeof getConfig>
