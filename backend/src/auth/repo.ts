import { NewAuthProvider, authProviders, users } from '@/db/schema'
import { db } from '@/db'
import { eq, and } from 'drizzle-orm'

export const authRepo = {
  async createProvider(provider: NewAuthProvider) {
    try {
      await db.insert(authProviders).values(provider)
    } catch (err) {
      throw err
    }
  },

  async getUserIDForKey(key: string, provider: NewAuthProvider["provider"]) {
    try {
      const userWithKey = await db.select().from(authProviders).where(and(
        eq(authProviders.key, key),
        eq(authProviders.provider, provider),
      )).leftJoin(users, eq(users.id, authProviders.userId))
      if(!userWithKey.length) {
        return null
      }
      return userWithKey[0].users?.id ?? null
    } catch (err) {
      throw err
    }
  }
}
