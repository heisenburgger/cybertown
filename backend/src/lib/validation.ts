import z from 'zod';

export const envSchema = z.object({
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  POSTGRES_DSN: z.string(),
  JWT_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRY: z.string(),
  JWT_REFRESH_TOKEN_EXPIRY: z.string(),
  WEB_REDIRECT_URL: z.string().url(),
  GOOGLE_CALLBACK_URL: z.string().url(),
  PORT: z.coerce.number(),
  ALLOWED_ORIGINS: z.string().transform(val => val.split(',')),
});

export type EnvSchema = z.infer<typeof envSchema>
