import { authRepo } from '@/auth/repo'
import { db } from '@/db'
import { NewAuthProvider, users } from '@/db/schema'
import { userRepo } from '@/user/repo'
import { eq } from 'drizzle-orm'

export const userService = {
  async createUser(user: {
    username: string
    avatar: string
    key: string
    provider: NewAuthProvider["provider"]
  }) {
    try {
      const newUser = await userRepo.create(user)
      await authRepo.createProvider({
        provider: user.provider,
        userId: newUser.id,
        key: user.key,
      })
      return newUser.id
    } catch(err) {
      throw err
    }
  },

  async updateUser(user: {
    username: string
    avatar: string
    userId: number
  }) {
    try {
      await db.update(users).set({
        avatar: user.avatar,
        username: user.username,
      }).where(eq(users.id, user.userId))
    } catch(err) {
      throw err
    }
  }
}

