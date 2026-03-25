import React, {useState} from "react";
import {
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import {useNavigation} from "@react-navigation/native";

import AwareView from "@components/AwareView";
import Button from "@components/Button";
import TextInput from "@components/TextInput";
import HeaderBackButton from "@components/Header/HeaderBackButton";

const CreateGroupScreen = () => {
	const navigation = useNavigation();
	const [name, setName] = useState("");
	const [about, setAbout] = useState("");
	const [category, setCategory] = useState("");

	const CATEGORIES = [
		{id: "1", name: "Programmer", icon: "code"},
		{id: "2", name: "Design", icon: "brush"},
		{id: "3", name: "Marketing", icon: "trending-up"},
		{id: "4", name: "Business", icon: "business"},
	];

	return (
		<AwareView backgroundColor="bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				className="w-full h-full bg-white">
				{/* Header */}
				<View className="px-4 pt-4 pb-6 border-b border-heyhao-border flex-row items-center">
					<HeaderBackButton />
					<Text className="text-2xl font-black text-heyhao-black ml-2">Create Group</Text>
				</View>

				<View className="p-6">
					{/* Icon Section */}
					<View className="items-center mb-8">
						<View className="bg-heyhao-blue/10 w-20 h-20 rounded-3xl items-center justify-center border-2 border-heyhao-blue/20">
							<Icon name="group-add" size={40} color="#165dff" />
						</View>
					</View>

					{/* Form Section */}
					<View className="gap-4 mb-8">
						<View>
							<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Group Name</Text>
							<TextInput
								onChangeText={setName}
								value={name}
								placeholder="e.g. React Native Developers"
								backgroundColor="bg-heyhao-grey"
								borderLess={false}
								borderColor="border-transparent"
								inputStyle="h-12 rounded-2xl px-4"
							/>
						</View>

						<View>
							<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Category</Text>
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								className="flex-row">
								{CATEGORIES.map((cat) => (
									<TouchableOpacity
										key={cat.id}
										onPress={() => setCategory(cat.name)}
										className={`flex-row items-center px-4 py-2 rounded-full mr-2 border ${
											category === cat.name
												? "bg-heyhao-blue border-heyhao-blue"
												: "bg-white border-heyhao-border"
										}`}>
										<Icon 
											name={cat.icon} 
											size={16} 
											color={category === cat.name ? "white" : "#165dff"} 
										/>
										<Text 
											className={`ml-2 text-xs font-bold ${
												category === cat.name
													? "text-white"
													: "text-heyhao-blue"
											}`}>
											{cat.name}
										</Text>
									</TouchableOpacity>
								))}
							</ScrollView>
						</View>

						<View>
							<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">About Group</Text>
							<TextInput
								onChangeText={setAbout}
								value={about}
								placeholder="Describe your group..."
								backgroundColor="bg-heyhao-grey"
								borderLess={false}
								borderColor="border-transparent"
								multiline
								textAlignVertical="top"
								style={{height: 100}}
								inputStyle="rounded-2xl px-4 pt-3"
							/>
							<Text className="text-heyhao-secondary text-xs mt-1 ml-1">{about.length}/500 characters</Text>
						</View>
					</View>

					{/* Privacy Settings */}
					<View className="bg-heyhao-grey rounded-2xl p-4 mb-8 border border-heyhao-border">
						<View className="flex-row items-center justify-between mb-3">
							<View className="flex-row items-center flex-1">
								<Icon name="lock" size={20} color="#165dff" />
								<Text className="text-heyhao-black font-bold text-sm ml-3">Public Group</Text>
							</View>
							<Icon name="check-circle" size={20} color="#30b22d" />
						</View>
						<Text className="text-heyhao-secondary text-xs">Anyone can find and join this group</Text>
					</View>

					{/* Create Button */}
					<Button
						onPress={() => {}}
						label="Create Group"
						buttonBackground="bg-heyhao-blue"
						borderRadius="rounded-2xl"
						buttonHeight="h-12"
						isDisabled={!name || !category}
					/>

					{/* Info */}
					<View className="flex-row items-start justify-center mt-6 px-4">
						<Icon name="info" size={16} color="#6a7686" />
						<Text className="text-heyhao-secondary text-xs ml-2 text-center leading-relaxed">
							By creating a group, you agree to our Community Guidelines and Terms of Service.
						</Text>
					</View>
				</View>
			</ScrollView>
		</AwareView>
	);
};

export default CreateGroupScreen;
