import { eq, sql } from 'drizzle-orm'
import { db } from '@/db'
import { NewUser, users } from '@/db/schema'
import { AppError, httpStatus } from '@/utils'

export const userRepo = {
  async upsert(user: NewUser) {
    try {
      await db.insert(users).values(user).onConflictDoUpdate({
        target: users.id,
        set: {
          username: sql`EXCLUDED.username`,
          avatar: sql`EXCLUDED.avatar`,
        }
      })
    } catch(err) {
      throw err
    }
  },

  async get(userId: string) {
    try {
      const rows = await db.select({
        id: users.id,
        username: users.username,
        avatar: users.avatar,
        bio: users.bio,
      }).from(users).where(eq(users.id, userId))
      if(rows.length) {
        return rows[0]
      }
      throw new AppError(httpStatus.NOT_FOUND, 'The user is not found')
    } catch(err) {
      throw err
    }
  }
}
