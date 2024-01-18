import {
	PrivateRoomMessage,
	RoomMessage,
	RoomJoinedPayload,
	RoomLeavePayload,
	User,
	RoomCoOwnershipPayload,
  RoomChatClearedPayload,
  RoomWelcomeMessagePayload,
} from '@/types';
import { queryClient } from '@/lib/queryClient';
import { appMediasoup } from '../AppMediasoup';
import { useRoomStore } from '@/stores';

export const roomHandler = {
	broadcastMessage(data: RoomMessage | PrivateRoomMessage) {
    console.log("broadcastMessage:", data)
    useRoomStore.getState().addEvent({
      type: 'message',
      payload: data
    })
	},

	participantJoined(data: RoomJoinedPayload) {
    console.log("participantJoined:", data)
    const user: User | undefined = queryClient.getQueryData(['me']);
		const isMe = user?.id === data.user.id;
		if (isMe) {
			appMediasoup.loadDevice(data.roomId, data.rtpCapabilities);
		} else {
      useRoomStore.getState().addEvent({
        type: 'log:join',
        payload: data
      })
    }
		invalidateRooms();
	},

	participantLeft(data: RoomLeavePayload) {
    console.log("participantLeft:", data)
    useRoomStore.getState().addEvent({
      type: 'log:leave',
      payload: data
    })
		invalidateRooms();
	},

	coOwnershipUpdated(data: RoomCoOwnershipPayload) {
    console.log("coOwnershipUpdated:", data)
    useRoomStore.getState().addEvent({
      type: 'log:coOwnership',
      payload: data
    })
		invalidateRooms();
	},

	clearChat(data: RoomChatClearedPayload) {
    console.log("clearChat:", data)
    useRoomStore.getState().addEvent({
      type: 'log:clearChat',
      payload: data
    })
    useRoomStore.getState().clearChat(data.to.id)
	},

	welcomeMessageUpdated(data: RoomWelcomeMessagePayload) {
    console.log("welcomeMessageUpdated(:", data)
    useRoomStore.getState().addEvent({
      type: 'log:welcomeMessage',
      payload: data
    })
		invalidateRooms();
	},
};

export function invalidateRooms() {
	queryClient.invalidateQueries({
		queryKey: ['rooms'],
	});
}
