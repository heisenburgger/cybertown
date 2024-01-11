import { ProfileUser, Room } from '@/types/entity'
import { RoomCoOwnershipPayload } from '@/types/event-payload'

export type RoomRole = 'owner' | 'co-owner' | 'guest'

export const roomService = {
  getRoomRole(userId: number, room: Room) {
    let roomRole: RoomRole = 'guest'
    if(room.metadata.owner === userId) {
      roomRole = 'owner'
    }
    if(room.metadata.coOwners?.includes(userId)) {
      roomRole = 'co-owner'
    }
    return roomRole
  },

  setCoOwnership(data: {
    participant: ProfileUser,
    op: '0' | '1',
    room: Room
    user: ProfileUser,
  }) {
    let event: RoomCoOwnershipPayload | null = null
    const { op, room, participant, user } = data

    // delete
    if(op === '0' && room.metadata.coOwners?.length) {
      room.metadata.coOwners = room.metadata.coOwners.filter(coOwner => coOwner !== participant.id)
      event = {
        type: 'unset',
        roomId: room.id,
        by: user,
        to: participant
      }
    } 

    // add
    if(op === '1') {
      if(!room.metadata.coOwners?.length) {
        room.metadata.coOwners = []
      }

      if(room.metadata.coOwners.includes(participant.id)) {
        return null
      }

      room.metadata.coOwners.push(participant.id)
      event = {
        type: 'set',
        roomId: room.id,
        by: user,
        to: participant
      }
    }

    return event
  },

  // transfers ownership and makes the current owner as co-owner.
  // removes the topic
  //v1/rooms/:roomId?coOwner=1
  transferOwnership() {
  },

  // adds the participant to the room blocklist for the specified
  // amount of duration
  kickParticipant() {
  }
}
