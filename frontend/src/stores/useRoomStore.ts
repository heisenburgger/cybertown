import { ProfileUser, RoomMediaKind } from '@/types'
import { create } from 'zustand'

type RoomState = {
  inPM: ProfileUser | null
  participants: Record<number, ParticipantState>

  // methods
  setInPM: (inPM: ProfileUser | null) => void
  setParticipants: (participants: ParticipantState) => void
}

type ParticipantProducer = {
  id: string
  userId: number
  roomKind: RoomMediaKind
}

type ParticipantConsumer = {
  id: string
  userId: number
  producerId: string
  roomKind: RoomMediaKind
}

export type ParticipantState = {
  producers: ParticipantProducer[]
  consumers: ParticipantConsumer[]
}

export const useRoomStore = create<RoomState>((set) => ({
  inPM: null,
  participants: {},
  setInPM: (inPM) => {
    set((state) => ({...state, inPM}))
  },
  setParticipants: (participants: ParticipantState) => {
    set(state => ({ ...state, participants }))
  }
}))
