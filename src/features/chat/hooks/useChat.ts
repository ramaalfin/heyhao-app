import {useState, useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {ChatRoom, ChatMessage} from "../types";
import apiClient from "../../../services/api/client/apiClient";
import socketService from "../../../services/socket/socketService";
import {selectAuthToken, selectUser} from "../../../store/UserSlice";

export const useChat = (roomId: string) => {
	const [roomDetail, setRoomDetail] = useState<ChatRoom | null>(null);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const authToken = useSelector(selectAuthToken);
	const user = useSelector(selectUser);

	const fetchMessages = useCallback(async () => {
		if (!roomId) return;
		try {
			setIsLoading(true);
			const response = await apiClient.chat.getRoomMessages(roomId);
			if (response.success) {
				const room = response.data;
				setRoomDetail(room);

				// tag messages with isOwn
				const taggedMessages = (room.messages || []).map((msg) => ({
					...msg,
					isOwn: msg.user?.id === user?.id,
				}));
				setMessages(taggedMessages);
			}
		} catch (error) {
			console.error("[useChat] error fetching messages", error);
		} finally {
			setIsLoading(false);
		}
	}, [roomId, user?.id]);

	useEffect(() => {
		fetchMessages();
	}, [fetchMessages]);

	useEffect(() => {
		if (!authToken) return;

		// Connect to socket when entering active chat
		socketService.connect(authToken);

		const handleNewMessage = (payload: any) => {
			if (payload.roomId === roomId) {
				const newMessage: ChatMessage = {
					id: payload.id,
					content: payload.content,
					type: payload.type || "TEXT",
					content_url: payload.content_url || null,
					created_at: payload.created_at,
					user: {
						id: payload.sender.id,
						name: payload.sender.name,
						photo_url: payload.sender.photo,
					},
					isOwn: payload.sender.id === user?.id,
				};

				setMessages((prev) => {
					// avoid duplicates if the HTTP request already got this message
					if (prev.some((m) => m.id === newMessage.id)) return prev;
					return [...prev, newMessage];
				});
			}
		};

		socketService.on("message:new", handleNewMessage);

		return () => {
			socketService.off("message:new", handleNewMessage);
		};
	}, [authToken, roomId, user?.id]);

	const sendMessage = async (content: string, attach?: any) => {
		if (!content.trim() && !attach) return;

		try {
			await apiClient.chat.sendMessage({
				room_id: roomId,
				message: content,
				attach,
			});
			// Message is broadcasted via socket, which appending it automatically
		} catch (error) {
			console.error("[useChat] error sending message", error);
			throw error;
		}
	};

	return {
		roomDetail,
		messages,
		isLoading,
		sendMessage,
	};
};
