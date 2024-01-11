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
  metadata: {
    owner: number,
    coOwners: number[],
    welcomeMessage?: string
  }
  createdBy: number;
}
