// TODO: use monorepo to prevent this type dupication
export type User = {
  id: number
  username: string
  avatar: string
  bio: string // TODO: how to type nullable fields?
}
