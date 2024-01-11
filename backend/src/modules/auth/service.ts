import { signJWT } from "@/lib/jwt"
import { userInfoSchema } from '@/modules/auth/validation'
import { config } from "@/index";
import { httpStatus } from "@/lib/utils";
import { AppError } from "@/lib/AppError";
import { Google } from "@/lib/google";

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
      const user = {
        key: parsedUserInfo.id,
        username: parsedUserInfo.name,
        avatar: parsedUserInfo.picture,
      }
      return user
    } catch (err) {
      throw err
    }
  },

  createTokens(userId: number, sessionId: number) {
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
