import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { NewUser, users } from '@/db/schema'
import { AppError, httpStatus } from '@/utils'

export const userRepo = {
  async create(user: NewUser) {
    try {
      const insertedUser = await db.insert(users).values(user).returning({
        id: users.id,
      })
      if(!insertedUser.length) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to create new user")
      }
      return insertedUser[0]
    } catch(err) {
      throw err
    }
  },

  async get(userId: number) {
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
