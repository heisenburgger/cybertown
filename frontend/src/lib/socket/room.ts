import {
	PrivateRoomMessage,
	RoomMessage,
	RoomJoinedPayload,
	RoomLeavePayload,
	User,
	RoomCoOwnershipPayload,
  RoomChatClearedPayload,
  RoomWelcomeMessagePayload,
  SocketRoom,
} from '@/types';
import { queryClient } from '@/lib/queryClient';
import { appMediasoup } from '../AppMediasoup';
import { useRoomStore } from '@/stores';
import { updateTitle } from '@/hooks/dom';
import { config } from '@/config';
import { Profile } from '@/pages/profile';

// the inevitable global variable (pls let me have this one)
let audioPlayedTimestamp = -1

export const roomHandler = {
	async broadcastMessage(data: RoomMessage | PrivateRoomMessage) {
    console.log("broadcastMessage:", data)
    const roomStore = useRoomStore.getState()
    const unreadMessages = roomStore.unreadMessages

    if(roomStore.widgetMode === 'collapsed') {
      roomStore.setUnreadMessagesFor('widgetCollapsed', unreadMessages.widgetCollapsed + 1)
    }

    const rooms: SocketRoom[] | undefined = queryClient.getQueryData(["rooms"])
    const room = rooms?.find(room => room.id === appMediasoup.roomId)
    console.log("hidden doc:", document.hidden)
    if(document.hidden && room) {
      const diff = Date.now() - audioPlayedTimestamp
      // 2.5s
      if(diff > 2500 || audioPlayedTimestamp === -1) {
        const audioURL  = new URL('/sounds/notification.mp3', import.meta.url).href
        const audio = new Audio(audioURL);
        try {
          // TODO: fix `user didn't interact with the document first`
          audio.play();
          audioPlayedTimestamp = Date.now()
        } catch(err) {
          console.log('error: failed to play audio:', err)
        }
      }
      const count = unreadMessages.tabInactive + 1
      roomStore.setUnreadMessagesFor('tabInactive', count)
      updateTitle(`(${count}) ${config.siteTitle} | ${room.topic}`)
    }

    roomStore.addEvent({
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
