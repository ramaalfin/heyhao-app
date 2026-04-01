import React, {useState} from "react";
import {
	FlatList,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import {useNavigation} from "@react-navigation/native";

import Avatar from "@components/Avatar";
import AwareView from "@components/AwareView";

const MOCK_CHATS = [
	{
		id: "1",
		name: "Arif Alfin",
		message: "Hey, can you help me with this React Native issue?",
		time: "10:30 AM",
		unread: 2,
		avatar: "AA",
		online: true,
	},
	{
		id: "2",
		name: "Design Community",
		message: "Check out the new design system update!",
		time: "Yesterday",
		unread: 0,
		avatar: "DC",
		online: false,
	},
	{
		id: "3",
		name: "Sarah Johnson",
		message: "Thanks for the feedback on my design!",
		time: "2 days ago",
		unread: 0,
		avatar: "SJ",
		online: true,
	},
	{
		id: "4",
		name: "React Native Devs",
		message: "New version released! Check it out.",
		time: "3 days ago",
		unread: 5,
		avatar: "RND",
		online: false,
	},
];

const ChatScreen = () => {
	const navigation = useNavigation();
	const [search, setSearch] = useState("");

	const handleChatPress = (chatId: string) => {
		(navigation.navigate as any)("ACTIVE_CHAT", {chatId});
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
				<FlatList
					data={MOCK_CHATS}
					keyExtractor={(item) => item.id}
					renderItem={({item}) => (
						<TouchableOpacity 
							onPress={() => handleChatPress(item.id)}
							className="px-4 py-3 border-b border-heyhao-border bg-white active:bg-heyhao-grey flex-row items-center">
							<View className="relative mr-3">
								<Avatar username={item.avatar} size={56} />
								{item.online && (
									<View className="absolute bottom-0 right-0 w-4 h-4 bg-heyhao-green rounded-full border-2 border-white" />
								)}
							</View>

							<View className="flex-1">
								<View className="flex-row items-center justify-between mb-1">
									<Text className="text-heyhao-black font-bold text-sm">{item.name}</Text>
									<Text className="text-heyhao-secondary text-xs">{item.time}</Text>
								</View>
								<Text 
									className={`text-xs ${item.unread > 0 ? "text-heyhao-black font-semibold" : "text-heyhao-secondary"}`}
									numberOfLines={1}>
									{item.message}
								</Text>
							</View>

							{item.unread > 0 && (
								<View className="bg-heyhao-blue rounded-full w-6 h-6 items-center justify-center ml-2">
									<Text className="text-white text-[10px] font-bold">{item.unread}</Text>
								</View>
							)}
						</TouchableOpacity>
					)}
					contentContainerStyle={{paddingBottom: 20}}
					scrollEnabled={true}
				/>
			</View>
		</AwareView>
	);
};

export default ChatScreen;
