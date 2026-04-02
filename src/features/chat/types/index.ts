export interface ChatUser {
	id: string;
	name: string;
	photo_url: string | null;
}

export interface ChatMessage {
	id?: string;
	content: string;
	type: "TEXT" | "IMAGE";
	content_url: string | null;
	user: ChatUser | null;
	created_at: string;

	// For UI purposes
	isOwn?: boolean;
}

export interface ChatGroup {
	name: string;
	photo_url: string | null;
	type: string;
	assets: string | null;
	benefit: string | null;
}

export interface RoomMember {
	user: ChatUser;
	joined_at?: string;
}

export interface ChatRoom {
	id: string;
	is_group: boolean;
	created_at: string;
	group: ChatGroup | null;
	messages: ChatMessage[];
	members: RoomMember[];
}

export interface ChatRoomsResponse {
	success: boolean;
	message: string;
	data: ChatRoom[];
}

export interface ActiveChatResponse {
	success: boolean;
	message: string;
	data: ChatRoom;
}

// Payload schemas
export interface CreateMessagePayload {
	room_id: string;
	message?: string;
	attach?: any; // e.g. from react-native-image-picker
}
