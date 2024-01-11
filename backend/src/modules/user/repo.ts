import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { httpStatus } from '@/lib/utils'
import { UpdateUser, NewUser } from '@/types/entity'
import { AppError } from '@/lib/AppError'

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
      return db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, userId)
      })
    } catch(err) {
      throw err
    }
  },

  async update(user: UpdateUser, userId: number) {
    try {
      await db.update(users).set({
        avatar: user.avatar,
        username: user.username,
      }).where(eq(users.id, userId))
    } catch(err) {
      throw err
    }
  },

  async getUserProfiles(userIds: number[]) {
    try {
      return db.query.users.findMany({
        columns: {
          id: true,
          username: true,
          avatar: true,
        },
        where: (users, { inArray }) => inArray(users.id, userIds)
      })
    } catch (err) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to fetch user profiles")
    }
  },
}
