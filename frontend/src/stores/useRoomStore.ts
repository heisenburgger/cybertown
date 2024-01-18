import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { ParticipantState, ProfileUser } from "@/types"
import { WidgetMode, WidgetTab } from '@/types'

type State = {
  // the participant with whom the logged in user is private messaging
  inPMWith: ProfileUser | null
  widgetMode: WidgetMode
  widgetTab: WidgetTab
  unreadMessagesCount: number
  participants: Record<number, ParticipantState>
}

type Actions = {
  setInPMWith: (inPMWith: ProfileUser | null) => void
  setWidgetTab: (widgetTab: WidgetTab) => void
  setWidgetMode: (widgetMode: WidgetMode) => void
}

export const useRoomStore = create<State & Actions>()(immer((set) => ({
  inPMWith: null,
  widgetTab: 'messages',
  widgetMode: 'collapsed',
  unreadMessagesCount: 0,
  participants: {},

  setInPMWith: (inPMWith) => set((state: State) => {
    state.inPMWith = inPMWith
  }),

  setWidgetTab: (widgetTab) => set((state: State) => {
    state.widgetTab = widgetTab
  }),

  setWidgetMode: (widgetMode) => set((state: State) => {
    state.widgetMode = widgetMode
  }),
})))
