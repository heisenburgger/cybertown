import { RoomMessage } from "@/types/entity-message"
import { RoomJoinPayload, RoomLeavePayload } from "@/types/event-payload"

export type RoomEvent = {
  type: "message"
  payload: RoomMessage
} | {
  type: "log:join"
  payload: RoomJoinPayload
} | {
  type: "log:leave"
  payload: RoomLeavePayload
}
