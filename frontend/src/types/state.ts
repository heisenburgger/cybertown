import { RoomMediaKind } from '@/types'

export type ParticipantProducer = {
  id: string
  userId: number
  roomKind: RoomMediaKind
}

export type ParticipantConsumer = {
  id: string
  userId: number
  producerId: string
  roomKind: RoomMediaKind
}

export type ParticipantState = {
  producers: ParticipantProducer[]
  consumers: ParticipantConsumer[]
}

export type WidgetTab = 'messages' | 'apps' | 'settings'

export type WidgetMode = 'collapsed' | 'expanded'

