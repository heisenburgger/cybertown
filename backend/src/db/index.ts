import { Pool } from 'pg'
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres'
import * as schema from '@/db/schema'
import { Config } from '@/config'

// TODO: better way exists?
export let db: NodePgDatabase<typeof schema>

export async function initDB(config: Config) {
  try {
    const pool = new Pool({
      host: config.postgres.host,
      port: config.postgres.port,
      user: config.postgres.user,
      password: config.postgres.password,
      database: config.postgres.db,
    })
    await pool.connect()
    db = drizzle(pool, { schema, logger: false })
  } catch (err) {
    throw new Error("failed to connect to db")
  }
}
