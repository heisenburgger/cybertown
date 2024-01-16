import { PrivateRoomMessage, RoomMessage } from "@/types/entity-message"
import { RoomChatClearedPayload, RoomCoOwnershipPayload, RoomJoinedPayload, RoomLeavePayload, RoomWelcomeMessagePayload } from "@/types/event-payload"

export type RoomEvent = {
  type: "message"
  payload: RoomMessage | PrivateRoomMessage
} | {
  type: "log:join"
  payload: RoomJoinedPayload
} | {
  type: "log:leave"
  payload: RoomLeavePayload
} | {
  type: "log:coOwnership"
  payload: RoomCoOwnershipPayload
} | {
  type: "log:welcomeMessage"
  payload: RoomWelcomeMessagePayload
} | {
  type: "log:clearChat"
  payload: RoomChatClearedPayload
}
