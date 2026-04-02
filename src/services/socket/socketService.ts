import {io, Socket} from "socket.io-client";
import {ChatMessage} from "../../features/chat/types";

import {Platform} from "react-native";

// Parse BASE_URL_API to get domain
let BASE_URL_API = (process.env as any).BASE_URL_API || "http://localhost:3000/api/v1";
if (Platform.OS === "android" && BASE_URL_API.includes("localhost")) {
	BASE_URL_API = BASE_URL_API.replace("localhost", "10.0.2.2");
}
const SOCKET_URL = BASE_URL_API.replace(/\/api\/v[0-9]+$/, "");

class SocketService {
	public socket: Socket | null = null;
	private listeners: Map<string, Function[]> = new Map();

	public connect(token: string) {
		if (this.socket?.connected) return;

		this.socket = io(SOCKET_URL, {
			transports: ["websocket"],
			auth: {
				token, // if backend checks token on handshake
			},
			extraHeaders: {
				Authorization: `JWT ${token}`,
			},
		});

		this.socket.on("connect", () => {
			console.log("[SocketService] Connected to real-time chat");
		});

		this.socket.on("disconnect", () => {
			console.log("[SocketService] Disconnected");
		});

		this.socket.on("message:new", (message: ChatMessage) => {
			this.trigger("message:new", message);
		});
	}

	public disconnect() {
		if (this.socket) {
			this.socket.disconnect();
			this.socket = null;
		}
	}

	// Simple event emitter
	public on(event: string, callback: Function) {
		if (!this.listeners.has(event)) {
			this.listeners.set(event, []);
		}
		this.listeners.get(event)?.push(callback);
	}

	public off(event: string, callback: Function) {
		const fns = this.listeners.get(event) || [];
		this.listeners.set(
			event,
			fns.filter((fn) => fn !== callback)
		);
	}

	private trigger(event: string, data: any) {
		const fns = this.listeners.get(event) || [];
		fns.forEach((fn) => fn(data));
	}
}

const socketService = new SocketService();
export default socketService;
