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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Avatar from "@components/Avatar";
import AwareView from "@components/AwareView";
import Button from "@components/Button";
import { useAuth } from "@hooks/useAuth";
import { NavigationParams } from "@navigation/Navigation";
import { SignedInStackParams } from "@navigation/stacks/SignedInStack";
import { NAVIGATOR_SIGNED_OUT_STACK, SETTINGS_SCREENS } from "@utils/screens";

const ProfileScreen = () => {
	const navigation =
		useNavigation<
			NativeStackNavigationProp<SignedInStackParams & NavigationParams>
		>();
	const { logout, user, getUserProfile } = useAuth();

	React.useEffect(() => {
		if (user?.id) {
			getUserProfile(user.id).catch(() => {
				// Silently fail as we still have local user state
			});
		}
	}, [user?.id, getUserProfile]);

	const handleLogout = async () => {
		if (!user?.id) {
			// If no user ID, just clear state and navigate
			navigation.replace(NAVIGATOR_SIGNED_OUT_STACK);
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

	const handleUpdateProfile = () => {
		navigation.navigate(SETTINGS_SCREENS.ACCOUNT);
	};

	return (
		<AwareView backgroundColor="bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ flexGrow: 1 }}
				className="w-full">
				{/* Header */}
				<View className="px-4 pt-4 pb-6 border-b border-heyhao-border">
					<Text className="text-2xl font-black text-heyhao-black">My Account</Text>
				</View>

				<View className="p-6 items-center">
					{/* Avatar Section */}
					<View className="items-center mb-8">
						<View className="relative mb-4">
							<Avatar username={user?.name || "User"} size={100} />
							<TouchableOpacity className="absolute bottom-0 right-0 bg-heyhao-blue rounded-full p-3 border-4 border-white shadow-lg">
								<Icon name="camera-alt" size={20} color="white" />
							</TouchableOpacity>
						</View>
						<Text className="text-heyhao-black font-bold text-xl">{user?.name || "HeyHao User"}</Text>
						<Text className="text-heyhao-secondary text-sm font-medium">Community Member</Text>
					</View>

					{/* Info Cards */}
					<View className="w-full gap-4 mb-8">
						<View className="bg-heyhao-grey rounded-2xl p-4 border border-heyhao-border">
							<Text className="text-heyhao-secondary text-xs font-bold uppercase tracking-widest mb-2">Email Address</Text>
							<Text className="text-heyhao-black font-bold text-sm">{user?.email || "No email provided"}</Text>
						</View>

						<View className="bg-heyhao-grey rounded-2xl p-4 border border-heyhao-border">
							<Text className="text-heyhao-secondary text-xs font-bold uppercase tracking-widest mb-2">User ID</Text>
							<Text className="text-heyhao-black font-bold text-sm">{user?.id || "N/A"}</Text>
						</View>
					</View>

					{/* Stats (Example - could be dynamic in future) */}
					<View className="w-full flex-row gap-3 mb-8">
						<View className="flex-1 bg-heyhao-blue/10 rounded-2xl p-4 items-center border border-heyhao-blue/20">
							<Icon name="people" size={24} color="#165dff" />
							<Text className="text-heyhao-black font-bold text-lg mt-2">245</Text>
							<Text className="text-heyhao-secondary text-xs font-medium">Connections</Text>
						</View>
						<View className="flex-1 bg-heyhao-green/10 rounded-2xl p-4 items-center border border-heyhao-green/20">
							<Icon name="chat" size={24} color="#30b22d" />
							<Text className="text-heyhao-black font-bold text-lg mt-2">48</Text>
							<Text className="text-heyhao-secondary text-xs font-medium">Messages</Text>
						</View>
					</View>

					{/* Buttons */}
					<View className="w-full gap-3 mb-8">
						<Button
							onPress={handleUpdateProfile}
							label="Edit Profile"
							buttonBackground="bg-heyhao-blue"
							borderRadius="rounded-2xl"
							buttonHeight="h-12"
						/>
					</View>
				</View>
			</ScrollView>
		</AwareView>
	);
};

export default ProfileScreen;
