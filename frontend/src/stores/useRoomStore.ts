import { ProfileUser, RoomMediaKind } from '@/types'
import { create } from 'zustand'

export type WidgetTab = 'messages' | 'apps' | 'settings'

type RoomState = {
  inPM: ProfileUser | null
  participants: Record<number, ParticipantState>
  isWidgetExpanded: boolean
  widgetTab: WidgetTab
  unreadMessagesCount: number

  // methods
  setInPM: (inPM: ProfileUser | null) => void
  setWidgetExpansion: (isExpanded: boolean) => void
  setParticipants: (participants: ParticipantState) => void
  setWidgetTab: (widgetTab: WidgetTab) => void
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
  isWidgetExpanded: true,
  widgetTab: 'messages',
  unreadMessagesCount: 0,

  setInPM: (inPM) => {
    set((state) => ({...state, inPM}))
  },
  setWidgetExpansion: (isWidgetExpanded) => set((state) => ({...state, isWidgetExpanded})),
  setParticipants: (participants: ParticipantState) => {
    set(state => ({ ...state, participants }))
  },
  setWidgetTab: (widgetTab) => {
    set((state) => ({...state, widgetTab}))
  },
}))
