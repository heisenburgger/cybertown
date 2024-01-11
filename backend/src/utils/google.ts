import { Auth, google } from 'googleapis'
import { type Config } from '@/config'

const scope = 'https://www.googleapis.com/auth/userinfo.profile'

export class Google {
  authClient: Auth.OAuth2Client

  constructor(config: Config['google']) {
    this.authClient = new Auth.OAuth2Client({
      clientId: config.clientID,
      clientSecret: config.clientSecret,
      redirectUri: config.redirectURL,
    })
  }

  getConsentScreenURL() {
    return this.authClient.generateAuthUrl({
      scope
    })
  }

  async getAccessToken(code: string) {
    try {
      const { tokens } = await this.authClient.getToken(code)
      if (typeof tokens.access_token === "string") {
        return tokens.access_token
      }
      return tokens.access_token
    } catch (err) {
      throw err
    }
  }

  async getUserInfo(accessToken: string) {
    try {
      this.authClient.setCredentials({ access_token: accessToken })
      const oauth = google.oauth2({
        auth: this.authClient,
        version: "v2"
      })
      const userInfo = await oauth.userinfo.get()
      return userInfo.data
    } catch (err) {
      throw err
    }
  }
}
