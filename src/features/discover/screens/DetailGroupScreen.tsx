import React from "react";
import {
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import {useNavigation} from "@react-navigation/native";

import AwareView from "@components/AwareView";
import Button from "@components/Button";

const DetailGroupScreen = () => {
	const navigation = useNavigation();

	return (
		<AwareView backgroundColor="bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				className="w-full h-full bg-white">
				{/* Header Image */}
				<View className="relative w-full h-48 bg-heyhao-grey">
					<Image
						source={{uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_6uDPmGozG5xUu8w3S_zI_5xYJ0iG-_8-wA&usqp=CAU"}}
						className="w-full h-full"
					/>
					<TouchableOpacity 
						onPress={() => navigation.goBack()}
						className="absolute top-4 left-4 bg-white rounded-full w-10 h-10 items-center justify-center shadow-lg">
						<Icon name="arrow-back" size={20} color="#165dff" />
					</TouchableOpacity>
					<TouchableOpacity className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 items-center justify-center shadow-lg">
						<Icon name="more-vert" size={20} color="#165dff" />
					</TouchableOpacity>
				</View>

				{/* Content */}
				<View className="px-4 py-6">
					{/* Title Section */}
					<View className="mb-6">
						<View className="flex-row items-center justify-between mb-3">
							<View className="flex-1">
								<Text className="text-2xl font-black text-heyhao-black mb-2">
									React Native Developers
								</Text>
								<View className="flex-row items-center gap-2">
									<View className="bg-heyhao-blue/10 px-3 py-1 rounded-full border border-heyhao-blue/20">
										<Text className="text-heyhao-blue text-xs font-bold">PROGRAMMER</Text>
									</View>
									<Icon name="verified" size={16} color="#165dff" />
								</View>
							</View>
						</View>
						<Text className="text-heyhao-secondary text-sm leading-relaxed">
							Welcome to the official group for React Native enthusiasts! Here we share tips, tricks, and the latest news about the framework.
						</Text>
					</View>

					{/* Stats */}
					<View className="flex-row gap-2 mb-6">
						<View className="flex-1 bg-heyhao-grey rounded-2xl p-4 items-center border border-heyhao-border">
							<Icon name="people" size={20} color="#165dff" />
							<Text className="text-heyhao-black font-bold text-base mt-2">1.2K</Text>
							<Text className="text-heyhao-secondary text-xs font-medium">Members</Text>
						</View>
						<View className="flex-1 bg-heyhao-grey rounded-2xl p-4 items-center border border-heyhao-border">
							<Icon name="event" size={20} color="#165dff" />
							<Text className="text-heyhao-black font-bold text-base mt-2">20+</Text>
							<Text className="text-heyhao-secondary text-xs font-medium">Events</Text>
						</View>
						<View className="flex-1 bg-heyhao-grey rounded-2xl p-4 items-center border border-heyhao-border">
							<Icon name="favorite" size={20} color="#165dff" />
							<Text className="text-heyhao-black font-bold text-base mt-2">450</Text>
							<Text className="text-heyhao-secondary text-xs font-medium">Likes</Text>
						</View>
					</View>

					{/* About Section */}
					<View className="mb-6">
						<Text className="text-sm font-bold text-heyhao-secondary uppercase tracking-widest mb-3">About</Text>
						<View className="bg-heyhao-grey rounded-2xl p-4 border border-heyhao-border">
							<Text className="text-heyhao-secondary text-sm leading-relaxed">
								Whether you are a beginner or an expert, you are welcome here. We discuss best practices, share resources, and help each other grow.
							</Text>
						</View>
					</View>

					{/* Rules Section */}
					<View className="mb-6">
						<Text className="text-sm font-bold text-heyhao-secondary uppercase tracking-widest mb-3">Group Rules</Text>
						<View className="bg-heyhao-grey rounded-2xl p-4 border border-heyhao-border gap-2">
							<View className="flex-row items-start">
								<Icon name="check-circle" size={16} color="#30b22d" />
								<Text className="text-heyhao-secondary text-sm ml-2 flex-1">No spam or self-promotion</Text>
							</View>
							<View className="flex-row items-start">
								<Icon name="check-circle" size={16} color="#30b22d" />
								<Text className="text-heyhao-secondary text-sm ml-2 flex-1">Be respectful to other members</Text>
							</View>
							<View className="flex-row items-start">
								<Icon name="check-circle" size={16} color="#30b22d" />
								<Text className="text-heyhao-secondary text-sm ml-2 flex-1">Only React Native related topics</Text>
							</View>
						</View>
					</View>

					{/* Join Button */}
					<Button
						onPress={() => {}}
						label="Join This Group"
						buttonBackground="bg-heyhao-blue"
						borderRadius="rounded-2xl"
						buttonHeight="h-12"
					/>
				</View>
			</ScrollView>
		</AwareView>
	);
};

export default DetailGroupScreen;
