import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ParticipantState, ProfileUser, RoomEvent } from "@/types"
import { WidgetMode, WidgetTab } from '@/types'

type State = {
  // the participant with whom the logged in user is private messaging
  inPMWith: ProfileUser | null
  widgetMode: WidgetMode
  widgetTab: WidgetTab
  participants: Record<number, ParticipantState>
  events: RoomEvent[]
  // count of unread messages when the widget is collapsed
  // and when the tab is inactive
  unreadMessages: {
    widgetCollapsed: number
    tabInactive: number
  }
  settings: {
    notification: boolean
  }
}

type Actions = {
  setInPMWith: (inPMWith: ProfileUser | null) => void
  setWidgetTab: (widgetTab: WidgetTab) => void
  setWidgetMode: (widgetMode: WidgetMode) => void
  setUnreadMessagesFor: (key: keyof State["unreadMessages"], count: number) => void
  addEvent: (event: RoomEvent) => void
  clearChat: (userId: number) => void
  setSettings: (key: keyof State["settings"], value: boolean) => void
}

export const useRoomStore = create<State & Actions>()(immer((set) => ({
  inPMWith: null,
  widgetTab: 'messages',
  widgetMode: 'expanded',
  participants: {},
  events: [],
  unreadMessages: {
    widgetCollapsed: 0,
    tabInactive: 0,
  },
  settings: {
    notification: true
  },

  // TODO: why type inference isn't working for `state` here?
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

  setUnreadMessagesFor: (key, count) => set((state: State) => {
    state.unreadMessages[key] = count
  }),

  clearChat: (userId) => set((state: State) => {
    state.events.forEach(event => {
      if(event.type === 'message' && event.payload.from.id === userId) {
        event.payload.isDeleted = true
        event.payload.content = ''
      }
    })
  }),

  setSettings: (key, value) => set((state: State) => {
    state.settings[key] = value
  }),
})))
