import { authRepo } from '@/modules/auth/repo'
import { userRepo } from '@/modules/user/repo'
import { NewAuthProvider } from '@/types/entity'

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
  }
}

