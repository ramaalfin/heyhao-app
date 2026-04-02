import {useState, useCallback} from "react";
import {useFocusEffect} from "@react-navigation/native";
import {ChatRoom} from "../types";
import apiClient from "../../../services/api/client/apiClient";

export const useChatRooms = () => {
	const [rooms, setRooms] = useState<ChatRoom[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const fetchRooms = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await apiClient.chat.getRooms();
			if (response.success) {
				setRooms(response.data);
			}
		} catch (error) {
			console.error("[useChatRooms] error", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			fetchRooms();
		}, [fetchRooms])
	);

	return {
		rooms,
		isLoading,
		refetch: fetchRooms,
	};
};
