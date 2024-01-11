import { RoomMessage } from "@/types/entity-message"
import { RoomChatClearedPayload, RoomCoOwnershipPayload, RoomJoinedPayload, RoomLeavePayload } from "@/types/event-payload"

export type RoomEvent = {
  type: "message"
  payload: RoomMessage
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
  type: "log:clearChat"
  payload: RoomChatClearedPayload
}
