import { config } from '@/config'
import { Helmet } from 'react-helmet'

export function Profile() {
  return (
    <div className="h-full flex items-center justify-center">
      <Helmet>
        <title>{config.siteTitle} | Profile</title>
      </Helmet>
      <p>This is the profile page</p>
    </div>
  )
}
