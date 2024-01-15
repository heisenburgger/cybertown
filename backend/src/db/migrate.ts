import { config as dotenvConfig } from 'dotenv'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { db, initDB } from '@/db';
import pg from 'pg'
import { getConfig, parseEnvVars } from '@/config';

dotenvConfig({ path: '../.env' })

// TODO: why migration script not running?
async function main() {
  try {
    const envVars = parseEnvVars()
    const config = getConfig(envVars)
    await initDB(config)
    const connection = new pg.Connection({
      host: config.postgres.host,
      port: config.postgres.port,
      user: config.postgres.user,
      password: config.postgres.password,
      database: config.postgres.db,
    });
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log("generated migrations")
    connection.end();
    process.exit(0)
  } catch(err) {
    console.error("failed to run migration:", err)
  }
}

main()
