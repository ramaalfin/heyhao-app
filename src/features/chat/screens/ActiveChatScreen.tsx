import React, { useState, useRef } from "react";
import {
	FlatList,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ActivityIndicator,
	Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useRoute } from "@react-navigation/native";
import moment from "moment";
import { useSelector } from "react-redux";

import Avatar from "@components/Avatar";
import AwareView from "@components/AwareView";
import HeaderBackButton from "@components/Header/HeaderBackButton";

import { photoUploader } from "@services/media/photoUploader";
import { useChat } from "../hooks/useChat";
import { selectUser } from "../../../store/UserSlice";
import { ChatMessage } from "../types";

const ActiveChatScreen = () => {
	const route = useRoute<any>();
	const chatId = route.params?.chatId;

	const { roomDetail, messages, isLoading, sendMessage } = useChat(chatId);
	const [message, setMessage] = useState("");
	const [sending, setSending] = useState(false);
	const currentUser = useSelector(selectUser);
	const flatListRef = useRef<FlatList>(null);

	const handleSend = async () => {
		if (!message.trim()) return;
		try {
			setSending(true);
			await sendMessage(message);
			setMessage("");
		} catch (error) {
			console.error("Failed to send message", error);
		} finally {
			setSending(false);
		}
	};

	const handleAttachImage = async () => {
		try {
			const photo = await photoUploader.selectFromGallery();
			if (photo) {
				const validation = photoUploader.validatePhoto(photo);
				if (!validation.isValid) {
					console.warn(validation.error);
					return;
				}

				setSending(true);
				// Send optional text message along with the photo
				await sendMessage(message, photo);
				setMessage("");
			}
		} catch (error) {
			console.error("Failed to pick image", error);
		} finally {
			setSending(false);
		}
	};

	let name = "Loading...";
	let avatar = "";

	if (roomDetail) {
		if (roomDetail.is_group && roomDetail.group) {
			name = roomDetail.group.name;
			avatar = roomDetail.group.photo_url || "";
		} else {
			const otherMember = roomDetail.members.find((m) => m.user.id !== currentUser?.id);
			if (otherMember) {
				name = otherMember.user.name;
				avatar = otherMember.user.photo_url || "";
			}
		}
	}

	return (
		<AwareView backgroundColor="bg-white">
			<View className="flex-1 bg-white">
				{/* Header */}
				<View className="px-4 pt-6 pb-4 border-b border-heyhao-border bg-white flex-row items-center justify-between">
					<View className="flex-row items-center flex-1">
						<HeaderBackButton />
						<View className="flex-1 ml-2">
							<Text className="text-heyhao-black font-bold text-base">{name}</Text>
							{/* <Text className="text-heyhao-secondary text-xs">Active now</Text> */}
						</View>
					</View>
					<TouchableOpacity className="bg-heyhao-grey p-2 rounded-full">
						<Icon name="more-vert" size={20} color="#165dff" />
					</TouchableOpacity>
				</View>

				{/* Messages List */}
				{isLoading ? (
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator size="large" color="#165dff" />
					</View>
				) : (
					<FlatList
						ref={flatListRef}
						data={messages.slice().reverse()}
						keyExtractor={(item, index) => item.id || `local-${index}`}
						renderItem={({ item }: { item: ChatMessage }) => (
							<View className={`px-4 py-2 flex-row ${item.isOwn ? "justify-end" : "justify-start"}`}>
								{!item.isOwn && (
									<Avatar image={item.user?.photo_url || ""} username={item.user?.name} size={32} />
								)}
								<View
									className={`max-w-xs mx-2 px-4 py-3 rounded-2xl ${item.isOwn
											? "bg-heyhao-blue rounded-br-none"
											: "bg-heyhao-grey rounded-bl-none"
										}`}>
									{item.type === "IMAGE" && item.content_url ? (
										<Image
											source={{ uri: item.content_url }}
											style={{ width: 150, height: 150, borderRadius: 8, marginBottom: 4 }}
											resizeMode="cover"
										/>
									) : null}

									{item.type !== "IMAGE" && (
										<Text className={`text-sm ${item.isOwn ? "text-white" : "text-heyhao-black"}`}>
											{item.content}
										</Text>
									)}
									<Text className={`text-xs mt-1 ${item.isOwn ? "text-white/70" : "text-heyhao-secondary"}`}>
										{moment(item.created_at).format("hh:mm A")}
									</Text>
								</View>
							</View>
						)}
						contentContainerStyle={{ paddingTop: 20 }}
						inverted={true}
					/>
				)}

				{/* Message Input */}
				<View className="px-4 py-4 border-t border-heyhao-border bg-white flex-row items-center gap-2">
					<TouchableOpacity
						className="bg-heyhao-grey p-3 rounded-full"
						onPress={handleAttachImage}
						disabled={sending}
					>
						<Icon name="add" size={20} color="#165dff" />
					</TouchableOpacity>
					<View className="flex-1 bg-heyhao-grey rounded-full px-4 py-3 flex-row items-center">
						<TextInput
							placeholder="Type a message..."
							value={message}
							onChangeText={setMessage}
							className="flex-1 text-heyhao-black"
							placeholderTextColor="#6a7686"
							onSubmitEditing={handleSend}
						/>
						<TouchableOpacity>
							<Icon name="emoji-emotions" size={20} color="#6a7686" />
						</TouchableOpacity>
					</View>
					<TouchableOpacity
						className={`p-3 rounded-full ${message.trim() || sending ? 'bg-heyhao-blue' : 'bg-heyhao-grey'}`}
						onPress={handleSend}
						disabled={!message.trim() || sending}
					>
						{sending ? (
							<ActivityIndicator size="small" color="white" />
						) : (
							<Icon name="send" size={20} color={message.trim() ? "white" : "#6a7686"} />
						)}
					</TouchableOpacity>
				</View>
			</View>
		</AwareView>
	);
};

export default ActiveChatScreen;
