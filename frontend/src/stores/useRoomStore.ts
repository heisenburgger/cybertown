import { ProfileUser, RoomMediaKind } from '@/types'
import { create } from 'zustand'

type RoomState = {
  inPM: ProfileUser | null
  setInPM: (inPM: ProfileUser | null) => void
  participants: Record<number, RoomParticipantState>
  setParticipants: (participants: RoomParticipantState) => void
}

type ConsumerState = {
  userId: number
  roomKind: RoomMediaKind
  producerId: string
  consumerId: string
}

export type RoomParticipantState = {
  producing: {
    screenshare: boolean
    microphone: boolean
    webcam: boolean
  },
  consuming: ConsumerState[]
  consumers: ConsumerState[] 
}

export const useRoomStore = create<RoomState>((set) => ({
  inPM: null,
  participants: {},
  setInPM: (inPM) => {
    set((state) => ({...state, inPM}))
  },
  setParticipants: (participants: RoomParticipantState) => {
    set(state => ({ ...state, participants }))
  }
}))
