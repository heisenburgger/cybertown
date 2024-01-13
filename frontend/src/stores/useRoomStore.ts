import { ProfileUser, RoomMediaKind } from '@/types'
import { create } from 'zustand'

type RoomState = {
  inPM: ProfileUser | null
  setInPM: (inPM: ProfileUser | null) => void
  participants: Record<number, ParticipantState>
  updateParticipantState: (participantId: number, state: ParticipantState) => void
}

type ParticipantState = {
  producing: {
    screenshare: boolean
    webcam: boolean,
    microphone: boolean,
  },
  consuming: boolean | {
    roomKind: RoomMediaKind
    producerId: string
    consumerId: string
  }
}

export const useRoomStore = create<RoomState>((set) => ({
  inPM: null,
  participants: {},
  setInPM: (inPM) => {
    set((state) => ({...state, inPM}))
  },
  updateParticipantState: (participantId, participantState) => {
    set((state) => ({
      ...state,
      participants: {
        ...state.participants,
        [participantId]: participantState
      }
    }))
  }
}))
