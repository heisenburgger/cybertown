export type User = {
  id: number;
  username: string;
  avatar: string;
  bio: string | null;
  createdAt: Date;
}

export type Room = {
  id: number;
  topic: string | null;
  language: string;
  maxParticipants: number;
  metadata: RoomMetadata
  createdBy: number;
}

type RoomMetadata = {
  owner: number,
  coOwners?: number[],
  welcomeMessage?: string
}

export type UpdateUser = Pick<User, 'username' | 'avatar'>
export type ProfileUser = Omit<User, 'bio' | 'createdAt'>

export type SocketRoom = Room & {
  participants: ProfileUser[]
}
