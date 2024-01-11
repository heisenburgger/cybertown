import { eq, and, sql } from 'drizzle-orm'
import { db } from '@/db'
import { NewSession, sessions } from '@/db/schema'

export const sessionRepo = {
  async create(session: NewSession) {
    try {
      const rows = await db.insert(sessions).values(session).returning({
        sessionId: sessions.id
      })
      return rows[0].sessionId
    } catch(err) {
      throw err
    }
  },

  async get(sessionId: number) {
    try {
      const rows = await db.select({
        id: sessions.id,
        userId: sessions.userId
      }).from(sessions).where(and(
         eq(sessions.id, sessionId),
         sql`${sessions.createdAt} > now() - interval '1 month'`
      ))
      if(rows.length) {
        return rows[0]
      }
    } catch(err) {
      throw err
    }
  },

  async delete(sessionId: number, userId: string) {
    try {
      await db.delete(sessions).where(and(
         eq(sessions.id, sessionId),
         eq(sessions.userId, userId),
      ))
    } catch(err) {
      throw err
    }
  }
}
