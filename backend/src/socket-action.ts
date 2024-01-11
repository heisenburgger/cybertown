type SocketAction = {
  action: "PING",
  payload: {
    userId: number
  }
} | {
  action: "JOIN_ROOM",
  payload: {
    userId: number,
    roomId: number
  }
} | {
  action: "ROOM_SEND_MESSAGE",
  payload: {
    userId: number,
    roomId: number
    text: string
  }
}
