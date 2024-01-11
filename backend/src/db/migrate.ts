import 'dotenv/config'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { db, initDB } from '@/db';
import pg from 'pg'
import { getConfig, parseEnvVars } from '@/config';

async function main() {
  try {
    const envVars = parseEnvVars()
    const config = getConfig(envVars)
    await initDB(config)
    const connection = new pg.Connection({
      connectionString: config.postgreDSN
    });
    await migrate(db, { migrationsFolder: '../drizzle' });
    connection.end();
  } catch(err) {
    console.error("failed to run migration:", err)
  }
}

main()
