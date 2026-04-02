import React, {useState} from "react";
import {
	FlatList,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import {useNavigation} from "@react-navigation/native";
import {useSelector} from "react-redux";
import moment from "moment";

import Avatar from "@components/Avatar";
import AwareView from "@components/AwareView";

import {useChatRooms} from "../hooks/useChatRooms";
import {selectUser} from "../../../store/UserSlice";
import {ChatRoom} from "../types";

const ChatScreen = () => {
	const navigation = useNavigation();
	const [search, setSearch] = useState("");
	const currentUser = useSelector(selectUser);

	const {rooms, isLoading} = useChatRooms();

	const handleChatPress = (chatId: string) => {
		(navigation.navigate as any)("ACTIVE_CHAT", {chatId});
	};

	const renderItem = ({item}: {item: ChatRoom}) => {
		// Determine name and avatar based on whether it's a group or personal chat
		let name = "Unknown";
		let avatar = "";
		let isOnline = false; // We don't have online status yet

		if (item.is_group && item.group) {
			name = item.group.name;
			avatar = item.group.photo_url || "";
		} else {
			const otherMember = item.members.find((m) => m.user.id !== currentUser?.id);
			if (otherMember) {
				name = otherMember.user.name;
				avatar = otherMember.user.photo_url || "";
			}
		}

		const latestMessage = item.messages?.[0];
		const messageText = latestMessage
			? latestMessage.type === "IMAGE"
				? "📷 Image"
				: latestMessage.content
			: "Started a chat";

		const timeDisplay = latestMessage
			? moment(latestMessage.created_at).fromNow(true)
			: moment(item.created_at).fromNow(true);

		return (
			<TouchableOpacity
				onPress={() => handleChatPress(item.id)}
				className="px-4 py-3 border-b border-heyhao-border bg-white active:bg-heyhao-grey flex-row items-center">
				<View className="relative mr-3">
					{/* Fallback to initials if no avatar URL */}
					<Avatar image={avatar} username={name} size={56} />
					{/* Online Indicator disabled for now since no backend source
					{isOnline && (
						<View className="absolute bottom-0 right-0 w-4 h-4 bg-heyhao-green rounded-full border-2 border-white" />
					)}
					*/}
				</View>

				<View className="flex-1">
					<View className="flex-row items-center justify-between mb-1">
						<Text className="text-heyhao-black font-bold text-sm">{name}</Text>
						<Text className="text-heyhao-secondary text-xs">{timeDisplay}</Text>
					</View>
					<Text
						className="text-xs text-heyhao-secondary"
						numberOfLines={1}>
						{messageText}
					</Text>
				</View>
			</TouchableOpacity>
		);
	};

	return (
		<AwareView backgroundColor="bg-white">
			<View className="flex-1 bg-white">
				{/* Header */}
				<View className="px-4 pt-6 pb-4 border-b border-heyhao-border bg-white">
					<View className="flex-row items-center justify-between mb-4">
						<Text className="text-2xl font-black text-heyhao-black">Messages</Text>
						<TouchableOpacity className="bg-heyhao-blue rounded-full p-2">
							<Icon name="edit" size={20} color="white" />
						</TouchableOpacity>
					</View>

					{/* Search Bar */}
					<View className="bg-heyhao-grey rounded-full px-4 py-3 flex-row items-center">
						<Icon name="search" size={20} color="#6a7686" />
						<TextInput
							placeholder="Search messages..."
							value={search}
							onChangeText={setSearch}
							className="flex-1 ml-2 text-heyhao-black"
							placeholderTextColor="#6a7686"
						/>
					</View>
				</View>

				{/* Chat List */}
				{isLoading ? (
					<View className="flex-1 justify-center items-center">
						<ActivityIndicator size="large" color="#165dff" />
					</View>
				) : (
					<FlatList
						data={rooms.filter((r) => {
							// Basic search implemented locally
							if (!search) return true;
							const nameInfo = r.is_group
								? r.group?.name
								: r.members.find((m) => m.user.id !== currentUser?.id)?.user.name;
							return nameInfo?.toLowerCase().includes(search.toLowerCase());
						})}
						keyExtractor={(item) => item.id}
						renderItem={renderItem}
						contentContainerStyle={{paddingBottom: 20}}
						scrollEnabled={true}
						ListEmptyComponent={
							<View className="p-8 items-center justify-center">
								<Text className="text-heyhao-secondary">No messages found.</Text>
							</View>
						}
					/>
				)}
			</View>
		</AwareView>
	);
};

export default ChatScreen;
