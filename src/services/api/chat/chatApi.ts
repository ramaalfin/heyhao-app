import type { AxiosInstance } from "axios";
import {
	ActiveChatResponse,
	ChatRoomsResponse,
	CreateMessagePayload,
} from "../../../features/chat/types";

export default class ChatApi {
	private client: AxiosInstance;

	constructor(client: AxiosInstance) {
		this.client = client;
	}

	/**
	 * Get the list of all chat rooms for the current user
	 */
	public async getRooms(): Promise<ChatRoomsResponse> {
		const response = await this.client.get<ChatRoomsResponse>("/chat/rooms");
		return response.data;
	}

	/**
	 * Get messages for a specific room
	 */
	public async getRoomMessages(roomId: string): Promise<ActiveChatResponse> {
		const response = await this.client.get<ActiveChatResponse>(`/chat/rooms/${roomId}`);
		return response.data;
	}

	/**
	 * Create a new personal room
	 */
	public async createRoomPersonal(userId: string): Promise<any> {
		const response = await this.client.post("/chat/rooms", { user_id: userId });
		return response.data;
	}

	/**
	 * Send a message to a room (Text or Attachment)
	 */
	public async sendMessage(payload: CreateMessagePayload): Promise<any> {
		const formData = new FormData();
		formData.append("room_id", payload.room_id);

		if (payload.message) {
			formData.append("message", payload.message);
		}

		if (payload.attach) {
			formData.append("attach", {
				uri: payload.attach.uri,
				type: payload.attach.type || "image/jpeg",
				name: payload.attach.fileName || payload.attach.name || "attach.jpg",
			} as any);
		}

		const response = await this.client.post("/chat/rooms/messages", formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		return response.data;
	}
}
