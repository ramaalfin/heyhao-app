import React from "react";
import {
	Alert,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { useNavigation } from "@react-navigation/native";

import Avatar from "@components/Avatar";
import AwareView from "@components/AwareView";
import { useAuth } from "@hooks/useAuth";

const SETTING_ITEMS = [
	{ id: "1", label: "My Account", icon: "person", color: "#165dff", screen: "ACCOUNT" },
	{ id: "2", label: "My Revenue", icon: "account-balance-wallet", color: "#30b22d", screen: "REVENUE" },
	{ id: "3", label: "My Groups", icon: "group", color: "#f97316", screen: "GROUPS" },
	{ id: "4", label: "Create Group", icon: "add-circle", color: "#fed71f", screen: "CREATE" },
	{ id: "5", label: "Privacy & Security", icon: "lock", color: "#ed6b60", screen: "PRIVACY" },
];

const SettingsScreen = () => {
	const navigation = useNavigation();
	const { logout, user } = useAuth();

	const handleNavigation = (screen: string) => {
		switch (screen) {
			case "ACCOUNT":
				navigation.navigate("ACCOUNT_SETTINGS" as never);
				break;
			case "REVENUE":
				navigation.navigate("REVENUE_SCREEN" as never);
				break;
			case "GROUPS":
				navigation.navigate("MY_GROUPS" as never);
				break;
			case "CREATE":
				navigation.navigate("CREATE_GROUP" as never);
				break;
			default:
				break;
		}
	};

	const handleLogout = async () => {
		if (!user?.id) {
			return;
		}

		Alert.alert(
			"Log Out",
			"Are you sure you want to log out?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "Log Out",
					style: "destructive",
					onPress: async () => {
						try {
							await logout(user.id);
							// Navigation will be handled automatically by Navigation component
							// when auth state is cleared
						} catch (error) {
							// Error is logged in authApi, state is still cleared
							// Silently handle error as logout cleanup still occurs
						}
					},
				},
			]
		);
	};

	return (
		<AwareView backgroundColor="bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				className="w-full h-full bg-white">
				{/* Header */}
				<View className="px-4 pt-6 pb-6 border-b border-heyhao-border">
					<Text className="text-2xl font-black text-heyhao-black">Settings ⚙️</Text>
				</View>

				{/* Settings List */}
				<View className="px-4 py-4">
					<Text className="text-sm font-bold text-heyhao-secondary uppercase tracking-widest mb-3">Preferences</Text>
					<View className="bg-white rounded-2xl border border-heyhao-border overflow-hidden">
						{SETTING_ITEMS.map((item, index) => (
							<React.Fragment key={item.id}>
								<TouchableOpacity
									onPress={() => handleNavigation(item.screen)}
									className="flex-row items-center justify-between py-4 px-4 active:bg-heyhao-grey">
									<View className="flex-row items-center flex-1">
										<View
											style={{ backgroundColor: item.color + "15" }}
											className="w-10 h-10 rounded-xl items-center justify-center mr-3 border border-heyhao-border">
											<Icon name={item.icon} size={20} color={item.color} />
										</View>
										<Text className="text-heyhao-black font-bold text-sm">{item.label}</Text>
									</View>
									<Icon name="chevron-right" size={20} color="#6a7686" />
								</TouchableOpacity>
								{index < SETTING_ITEMS.length - 1 && (
									<View className="h-px bg-heyhao-border mx-4" />
								)}
							</React.Fragment>
						))}
					</View>
				</View>

				{/* App Info */}
				<View className="px-4 py-6">
					<Text className="text-sm font-bold text-heyhao-secondary uppercase tracking-widest mb-3">About</Text>
					<View className="bg-heyhao-grey rounded-2xl p-4 border border-heyhao-border">
						<View className="flex-row items-center justify-between mb-3">
							<Text className="text-heyhao-secondary text-sm font-medium">App Version</Text>
							<Text className="text-heyhao-black font-bold text-sm">1.0.0</Text>
						</View>
						<View className="flex-row items-center justify-between">
							<Text className="text-heyhao-secondary text-sm font-medium">Last Updated</Text>
							<Text className="text-heyhao-black font-bold text-sm">Today</Text>
						</View>
					</View>
				</View>

				{/* Logout Button */}
				<View className="px-4 py-4">
					<TouchableOpacity
						onPress={handleLogout}
						className="flex-row items-center justify-center py-4 bg-heyhao-coral/10 rounded-2xl border border-heyhao-coral/20 active:bg-heyhao-coral/20">
						<Icon name="logout" size={20} color="#ed6b60" />
						<Text className="text-heyhao-coral font-bold text-sm ml-2">Log Out</Text>
					</TouchableOpacity>
				</View>

				<View className="h-6" />
			</ScrollView>
		</AwareView>
	);
};

export default SettingsScreen;
