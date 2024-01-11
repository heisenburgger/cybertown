import { users, authProviders, sessions, rooms } from '@/db/schema'

export type NewUser = typeof users.$inferInsert
export type User = typeof users.$inferSelect
export type UpdateUser = Pick<User, 'username' | 'avatar'>
export type ProfileUser = Omit<User, 'bio' | 'createdAt'>

export type NewAuthProvider = typeof authProviders.$inferInsert

export type NewSession = typeof sessions.$inferInsert

export type Room = typeof rooms.$inferSelect
export type NewRoom = typeof rooms.$inferInsert
export type SocketRoom = Omit<Room, 'createdBy'> & {
  participants: ProfileUser[]
  createdBy: ProfileUser
}

