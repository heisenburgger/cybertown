import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ParticipantState, ProfileUser, RoomEvent } from "@/types"
import { WidgetMode, WidgetTab } from '@/types'

type State = {
  // the participant with whom the logged in user is private messaging
  inPMWith: ProfileUser | null
  widgetMode: WidgetMode
  widgetTab: WidgetTab
  unreadMessagesCount: number
  participants: Record<number, ParticipantState>
  events: RoomEvent[]
}

type Actions = {
  setInPMWith: (inPMWith: ProfileUser | null) => void
  setWidgetTab: (widgetTab: WidgetTab) => void
  setWidgetMode: (widgetMode: WidgetMode) => void
  addEvent: (event: RoomEvent) => void
  clearChat: (userId: number) => void
}

export const useRoomStore = create<State & Actions>()(immer((set) => ({
  inPMWith: null,
  widgetTab: 'messages',
  widgetMode: 'expanded',
  unreadMessagesCount: 0,
  participants: {},
  events: [],

  setInPMWith: (inPMWith) => set((state: State) => {
    state.inPMWith = inPMWith
  }),

  setWidgetTab: (widgetTab) => set((state: State) => {
    state.widgetTab = widgetTab
  }),

  setWidgetMode: (widgetMode) => set((state: State) => {
    state.widgetMode = widgetMode
  }),

  addEvent: (event: RoomEvent) => set((state: State) => {
    state.events.push(event)
  }),

  clearChat: (userId) => set((state: State) => {
    state.events.forEach(event => {
      if(event.type === 'message' && event.payload.from.id === userId) {
        event.payload.isDeleted = true
        event.payload.content = ''
      }
    })
  })
})))
