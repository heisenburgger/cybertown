import { NewUser } from "@/db/schema"
import { Google, AppError, httpStatus, signJWT } from "@/utils"
import { userInfoSchema } from '@/auth/validation'
import { config } from "..";

export const authService = {
  async getUserFromAuthProvider(code: string) {
    const google = new Google(config.google)
    try {
      const token = await google.getAccessToken(code)
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Failed to get access token")
      }
      const userInfo = await google.getUserInfo(token)
      const parsedUserInfo = userInfoSchema.parse(userInfo)
      const user: NewUser = {
        id: parsedUserInfo.id,
        username: parsedUserInfo.name,
        avatar: parsedUserInfo.picture,
        bio: "",
      }
      return user
    } catch (err) {
      throw err
    }
  },

  createTokens(userId: string, sessionId: number) {
    const accessToken = signJWT({
      userId,
      sessionId,
    }, config.jwt.accessTokenExpiry)
    const refreshToken = signJWT({
      sessionId,
    }, config.jwt.refreshTokenExpiry)
    return [accessToken, refreshToken] as const
  },

  getRedirectURL() {
    const google = new Google(config.google)
    return google.getConsentScreenURL()
  }
}
