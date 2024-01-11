import { User, Room } from '@/types/entity-drizzle'

export type UpdateUser = Pick<User, 'username' | 'avatar'>
export type ProfileUser = Omit<User, 'bio' | 'createdAt'>

export type SocketRoom = Room & {
  participants: ProfileUser[]
}
