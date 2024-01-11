import { sessionRepo } from "@/modules/session/repo"
import { verifyJWT } from "./jwt"

type AccessTokenPayload = {
  userId: number
  sessionId: number
}

type RefreshTokenPayload = {
  sessionId: number
}

export async function validateTokens(cookies: Record<string, any>) {
  const { accessToken, refreshToken } = cookies 
  const accessTokenPayload = verifyJWT<AccessTokenPayload>(accessToken)
  if(accessTokenPayload) {
    return {
      userId: accessTokenPayload.userId,
      sessionId: accessTokenPayload.sessionId,
    }
  }
  const refreshTokenPayload = verifyJWT<RefreshTokenPayload>(refreshToken)
  if(!refreshTokenPayload) {
    return null
  }
  try {
    const session = await sessionRepo.get(refreshTokenPayload.sessionId)
    if(!session) {
      return null
    }
    return {
      sessionId: session.id,
      userId: session.userId
    }
  } catch(err) {
    return null
  }
}
