import {
	PrivateRoomMessage,
	RoomEvent,
	RoomMessage,
	RoomJoinedPayload,
	RoomLeavePayload,
	User,
	RoomCoOwnershipPayload,
  RoomChatClearedPayload,
} from '@/types';
import { queryClient } from '@/lib/queryClient';
import { appMediasoup } from '../AppMediasoup';

export const roomHandler = {
	broadcastMessage(data: RoomMessage | PrivateRoomMessage) {
		queryClient.setQueriesData(
			{
				queryKey: ['room:events', data.roomId],
			},
			(oldData) => {
				const events = oldData as RoomEvent[];
				const event: RoomEvent = {
					type: 'message',
					payload: data,
				};
				return [...events, event];
			},
		);
	},

	participantJoined(data: RoomJoinedPayload) {
		queryClient.setQueriesData(
			{
				queryKey: ['room:events', data.roomId],
			},
			(oldData) => {
				const me: User | undefined = queryClient.getQueryData(['me']);
				if (me?.id === data.user.id) {
					return;
				}
				const events = oldData as RoomEvent[];
				const event: RoomEvent = {
					type: 'log:join',
					payload: data,
				};
				return [...events, event];
			},
		);

		const user: User | undefined = queryClient.getQueryData(['me']);
		const isMe = user?.id === data.user.id;
		if (isMe) {
			appMediasoup.loadDevice(data.roomId, data.rtpCapabilities);
		}

		invalidateRooms();
	},

	participantLeft(data: RoomLeavePayload) {
		queryClient.setQueriesData(
			{
				queryKey: ['room:events', data.roomId],
			},
			(oldData) => {
				const events = oldData as RoomEvent[];
				const event: RoomEvent = {
					type: 'log:leave',
					payload: data,
				};
				return [...events, event];
			},
		);

		invalidateRooms();
	},

	coOwnershipUpdated(data: RoomCoOwnershipPayload) {
		queryClient.setQueriesData(
			{
				queryKey: ['room:events', data.roomId],
			},
			(oldData) => {
				const events = oldData as RoomEvent[];
				const event: RoomEvent = {
					type: 'log:coOwnership',
					payload: data,
				};
				return [...events, event];
			},
		);
		invalidateRooms();
	},

	clearChat(data: RoomChatClearedPayload) {
		queryClient.setQueriesData(
			{
				queryKey: ['room:events', data.roomId],
			},
			(oldData) => {
				const events = oldData as RoomEvent[];
				const event: RoomEvent = {
					type: 'log:clearChat',
					payload: data,
				};
				return [...events, event].map((event) => {
					if (
						event.type === 'message' &&
						event.payload.from.id === data.to.id
					) {
						return {
							...event,
							payload: {
								...event.payload,
								content: '',
								isDeleted: true,
							},
						};
					}
					return event;
				});
			},
		);
    invalidateRooms()
	},
};

export function invalidateRooms() {
	queryClient.invalidateQueries({
		queryKey: ['rooms'],
	});
}
