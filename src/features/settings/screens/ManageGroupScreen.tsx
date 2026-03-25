import React from "react";
import {
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import {useNavigation} from "@react-navigation/native";

import AwareView from "@components/AwareView";
import HeaderBackButton from "@components/Header/HeaderBackButton";

const ADMIN_ACTIONS = [
	{id: "1", label: "Edit Group Details", icon: "edit", color: "#165dff", badge: null},
	{id: "2", label: "Member Requests", icon: "people", color: "#30b22d", badge: "5"},
	{id: "3", label: "Announcements", icon: "broadcast-on-home", color: "#f97316", badge: null},
	{id: "4", label: "Group Rules", icon: "rule", color: "#442462", badge: null},
	{id: "5", label: "Delete Group", icon: "delete", color: "#ed6b60", badge: null},
];

const ManageGroupScreen = () => {
	const navigation = useNavigation();

	return (
		<AwareView backgroundColor="bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				className="w-full h-full bg-white">
				{/* Header */}
				<View className="px-4 pt-4 pb-6 border-b border-heyhao-border flex-row items-center">
					<HeaderBackButton />
					<Text className="text-2xl font-black text-heyhao-black ml-2">Manage Group</Text>
				</View>

				<View className="p-4">
					{/* Group Info Card */}
					<View className="bg-heyhao-grey rounded-2xl p-4 mb-6 border border-heyhao-border">
						<View className="flex-row items-center mb-3">
							<View className="bg-heyhao-blue/10 w-12 h-12 rounded-xl items-center justify-center mr-3">
								<Icon name="group" size={24} color="#165dff" />
							</View>
							<View className="flex-1">
								<Text className="text-heyhao-black font-bold text-sm">React Native Developers</Text>
								<Text className="text-heyhao-secondary text-xs">1,200 members • 45 posts</Text>
							</View>
						</View>
					</View>

					{/* Admin Actions */}
					<Text className="text-sm font-bold text-heyhao-secondary uppercase tracking-widest mb-3">Admin Controls</Text>
					<View className="bg-white rounded-2xl border border-heyhao-border overflow-hidden">
						{ADMIN_ACTIONS.map((action, index) => (
							<React.Fragment key={action.id}>
								<TouchableOpacity 
									className={`flex-row items-center justify-between py-4 px-4 active:bg-heyhao-grey ${
										action.id === "5" ? "bg-heyhao-coral/5" : ""
									}`}>
									<View className="flex-row items-center flex-1">
										<View 
											style={{backgroundColor: action.color + "15"}}
											className="w-10 h-10 rounded-xl items-center justify-center mr-3 border border-heyhao-border">
											<Icon name={action.icon} size={20} color={action.color} />
										</View>
										<Text className={`font-bold text-sm ${
											action.id === "5" ? "text-heyhao-coral" : "text-heyhao-black"
										}`}>
											{action.label}
										</Text>
									</View>
									<View className="flex-row items-center gap-2">
										{action.badge && (
											<View className="bg-heyhao-green rounded-full px-2 py-1">
												<Text className="text-white text-xs font-bold">{action.badge}</Text>
											</View>
										)}
										<Icon name="chevron-right" size={20} color="#6a7686" />
									</View>
								</TouchableOpacity>
								{index < ADMIN_ACTIONS.length - 1 && (
									<View className="h-px bg-heyhao-border mx-4" />
								)}
							</React.Fragment>
						))}
					</View>

					{/* Stats */}
					<View className="mt-8">
						<Text className="text-sm font-bold text-heyhao-secondary uppercase tracking-widest mb-3">Statistics</Text>
						<View className="flex-row gap-3">
							<View className="flex-1 bg-heyhao-blue/10 rounded-2xl p-4 items-center border border-heyhao-blue/20">
								<Icon name="people" size={24} color="#165dff" />
								<Text className="text-heyhao-black font-bold text-lg mt-2">1.2K</Text>
								<Text className="text-heyhao-secondary text-xs font-medium">Members</Text>
							</View>
							<View className="flex-1 bg-heyhao-green/10 rounded-2xl p-4 items-center border border-heyhao-green/20">
								<Icon name="chat" size={24} color="#30b22d" />
								<Text className="text-heyhao-black font-bold text-lg mt-2">45</Text>
								<Text className="text-heyhao-secondary text-xs font-medium">Posts</Text>
							</View>
						</View>
					</View>
				</View>
			</ScrollView>
		</AwareView>
	);
};

export default ManageGroupScreen;
