import React, {useState} from "react";
import {
	FlatList,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import Avatar from "@components/Avatar";
import AwareView from "@components/AwareView";
import HeaderBackButton from "@components/Header/HeaderBackButton";

const MOCK_MESSAGES = [
	{
		id: "1",
		sender: "Arif Alfin",
		message: "Hey! How are you doing?",
		time: "10:30 AM",
		isOwn: false,
		avatar: "AA",
	},
	{
		id: "2",
		sender: "You",
		message: "I'm doing great! Just working on a new project.",
		time: "10:32 AM",
		isOwn: true,
		avatar: "YO",
	},
	{
		id: "3",
		sender: "Arif Alfin",
		message: "That's awesome! What kind of project?",
		time: "10:33 AM",
		isOwn: false,
		avatar: "AA",
	},
	{
		id: "4",
		sender: "Arif Alfin",
		message: "I'm building a chat app with React Native 🚀",
		time: "10:34 AM",
		isOwn: false,
		avatar: "AA",
	},
	{
		id: "5",
		sender: "You",
		message: "That sounds interesting! Let me know if you need help.",
		time: "10:35 AM",
		isOwn: true,
		avatar: "YO",
	},
];

const ActiveChatScreen = () => {
	const [message, setMessage] = useState("");

	return (
		<AwareView backgroundColor="bg-white">
			<View className="flex-1 bg-white">
				{/* Header */}
				<View className="px-4 pt-6 pb-4 border-b border-heyhao-border bg-white flex-row items-center justify-between">
					<View className="flex-row items-center flex-1">
						<HeaderBackButton />
						<View className="flex-1 ml-2">
							<Text className="text-heyhao-black font-bold text-base">Arif Alfin</Text>
							<Text className="text-heyhao-secondary text-xs">Active now</Text>
						</View>
					</View>
					<TouchableOpacity className="bg-heyhao-grey p-2 rounded-full">
						<Icon name="more-vert" size={20} color="#165dff" />
					</TouchableOpacity>
				</View>

				{/* Messages List */}
				<FlatList
					data={MOCK_MESSAGES}
					keyExtractor={(item) => item.id}
					renderItem={({item}) => (
						<View className={`px-4 py-2 flex-row ${item.isOwn ? "justify-end" : "justify-start"}`}>
							{!item.isOwn && (
								<Avatar username={item.avatar} size={32} />
							)}
							<View 
								className={`max-w-xs mx-2 px-4 py-3 rounded-2xl ${
									item.isOwn
										? "bg-heyhao-blue rounded-br-none"
										: "bg-heyhao-grey rounded-bl-none"
								}`}>
								<Text className={`text-sm ${item.isOwn ? "text-white" : "text-heyhao-black"}`}>
									{item.message}
								</Text>
								<Text className={`text-xs mt-1 ${item.isOwn ? "text-white/70" : "text-heyhao-secondary"}`}>
									{item.time}
								</Text>
							</View>
							{item.isOwn && (
								<Avatar username={item.avatar} size={32} />
							)}
						</View>
					)}
					contentContainerStyle={{paddingBottom: 20}}
					inverted={false}
				/>

				{/* Message Input */}
				<View className="px-4 py-4 border-t border-heyhao-border bg-white flex-row items-center gap-2">
					<TouchableOpacity className="bg-heyhao-grey p-3 rounded-full">
						<Icon name="add" size={20} color="#165dff" />
					</TouchableOpacity>
					<View className="flex-1 bg-heyhao-grey rounded-full px-4 py-3 flex-row items-center">
						<TextInput
							placeholder="Type a message..."
							value={message}
							onChangeText={setMessage}
							className="flex-1 text-heyhao-black"
							placeholderTextColor="#6a7686"
						/>
						<TouchableOpacity>
							<Icon name="emoji-emotions" size={20} color="#6a7686" />
						</TouchableOpacity>
					</View>
					<TouchableOpacity className="bg-heyhao-blue p-3 rounded-full">
						<Icon name="send" size={20} color="white" />
					</TouchableOpacity>
				</View>
			</View>
		</AwareView>
	);
};

export default ActiveChatScreen;
