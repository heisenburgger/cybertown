import { parseEnvVars } from '@/config';
import { config as dotenvConfig } from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenvConfig({ path: '../.env' })

const config = parseEnvVars()

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: config.POSTGRES_HOST,
    port: config.POSTGRES_PORT,
    password: config.POSTGRES_PASSWORD,
    user: config.POSTGRES_USER,
    database: config.POSTGRES_DB,
  }
} satisfies Config;
