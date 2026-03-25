import React, { useEffect, useState } from "react";
import {
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import { useNavigation } from "@react-navigation/native";

import Avatar from "@components/Avatar";
import AwareView from "@components/AwareView";
import Button from "@components/Button";
import TextInput from "@components/TextInput";
import { useAppDispatch, useAppSelector } from "@store/hooks";

const AccountSettingsScreen = () => {
	const navigation = useNavigation();
	const [profilePicture, setProfilePicture] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	const dispatch = useAppDispatch();

	const { user } = useAppSelector((state) => state.UserSlice);

	useEffect(() => {
		if (user) {
			setName(user.name);
			setEmail(user.email);
			setProfilePicture(user.photo);
		}
	}, [user]);

	const handleUpdateProfile = () => {

	};

	return (
		<AwareView backgroundColor="bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				className="w-full h-full bg-white">
				{/* Header */}
				<View className="px-4 pt-4 pb-6 border-b border-heyhao-border flex-row items-center">
					<TouchableOpacity
						onPress={() => navigation.goBack()}
						className="bg-heyhao-grey w-10 h-10 rounded-full items-center justify-center mr-4">
						<Icon name="arrow-back" size={20} color="#165dff" />
					</TouchableOpacity>
					<Text className="text-2xl font-black text-heyhao-black">Edit Profile</Text>
				</View>

				<View className="p-6">
					{/* Avatar Section */}
					<View className="items-center mb-8">
						<View className="relative mb-4">
							{profilePicture ? (
								<Image source={{ uri: profilePicture }} style={{ width: 100, height: 100, borderRadius: 50 }} />
							) : (
								<Avatar username={name.split(" ")[0].toUpperCase()} size={100} />
							)}
							<TouchableOpacity className="absolute bottom-0 right-0 bg-heyhao-blue rounded-full p-3 border-4 border-white shadow-lg">
								<Icon name="camera-alt" size={20} color="white" />
							</TouchableOpacity>
						</View>
						<TouchableOpacity className="bg-heyhao-grey rounded-full px-6 py-2 flex-row items-center border border-heyhao-border">
							<Icon name="delete" size={16} color="#ed6b60" />
							<Text className="text-heyhao-coral font-bold text-xs ml-2">Remove Photo</Text>
						</TouchableOpacity>
					</View>

					{/* Form Section */}
					<View className="gap-4 mb-8">
						<View>
							<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Display Name</Text>
							<TextInput
								onChangeText={setName}
								value={name}
								backgroundColor="bg-heyhao-grey"
								borderLess={false}
								borderColor="border-transparent"
								inputStyle="h-12 rounded-2xl px-4"
							/>
						</View>

						<View>
							<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Email Address</Text>
							<TextInput
								onChangeText={setEmail}
								value={email}
								backgroundColor="bg-heyhao-grey"
								borderLess={false}
								borderColor="border-transparent"
								inputStyle="h-12 rounded-2xl px-4"
							/>
						</View>
					</View>

					{/* Save Button */}
					<Button
						onPress={() => { }}
						label="Save Changes"
						buttonBackground="bg-heyhao-blue"
						borderRadius="rounded-2xl"
						buttonHeight="h-12"
					/>
				</View>
			</ScrollView>
		</AwareView>
	);
};

export default AccountSettingsScreen;
