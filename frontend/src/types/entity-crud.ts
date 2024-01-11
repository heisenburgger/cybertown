export type UpdateRoom = {
  topic?: string
  language?: string
  maxParticipants?: number
  metadata?: {
    owner?: number
    coOwners?: number[]
    welcomeMessage?: string
  }
}
