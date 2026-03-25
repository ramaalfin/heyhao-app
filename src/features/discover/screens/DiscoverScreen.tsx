import React, {useState} from "react";
import {
	FlatList,
	Image,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import AwareView from "@components/AwareView";

const CATEGORIES = [
	{id: "1", name: "Programmer", icon: "code"},
	{id: "2", name: "Design", icon: "brush"},
	{id: "3", name: "Marketing", icon: "trending-up"},
	{id: "4", name: "Business", icon: "business"},
];

const MOCK_GROUPS = [
	{
		id: "1",
		name: "React Native Developers",
		members: 1200,
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_6uDPmGozG5xUu8w3S_zI_5xYJ0iG-_8-wA&usqp=CAU",
		category: "Programmer",
		verified: true,
	},
	{
		id: "2",
		name: "UI/UX Indonesia",
		members: 850,
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT66L6_zYv3o0C_7S3-5N_4v6y2o3Y4z9j-Zg&usqp=CAU",
		category: "Design",
		verified: true,
	},
	{
		id: "3",
		name: "Web Development",
		members: 2100,
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_6uDPmGozG5xUu8w3S_zI_5xYJ0iG-_8-wA&usqp=CAU",
		category: "Programmer",
		verified: false,
	},
];

const DiscoverScreen = () => {
	const [tab, setTab] = useState<"GROUP" | "PEOPLE">("GROUP");
	const [search, setSearch] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

	return (
		<AwareView backgroundColor="bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{flexGrow: 1}}
				className="w-full h-full bg-white">
				{/* Header */}
				<View className="px-4 pt-6 pb-4 border-b border-heyhao-border">
					<Text className="text-2xl font-black text-heyhao-black mb-4">Discover 🚀</Text>

					{/* Search Bar */}
					<View className="bg-heyhao-grey rounded-full px-4 py-3 flex-row items-center mb-4">
						<Icon name="search" size={20} color="#6a7686" />
						<TextInput
							placeholder="Search groups or people..."
							value={search}
							onChangeText={setSearch}
							className="flex-1 ml-2 text-heyhao-black"
							placeholderTextColor="#6a7686"
						/>
					</View>

					{/* Categories */}
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						className="flex-row">
						{CATEGORIES.map((cat) => (
							<TouchableOpacity
								key={cat.id}
								onPress={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
								className={`flex-row items-center px-4 py-2 rounded-full mr-2 border ${
									selectedCategory === cat.id
										? "bg-heyhao-blue border-heyhao-blue"
										: "bg-white border-heyhao-border"
								}`}>
								<Icon 
									name={cat.icon} 
									size={16} 
									color={selectedCategory === cat.id ? "white" : "#165dff"} 
								/>
								<Text 
									className={`ml-2 text-xs font-bold ${
										selectedCategory === cat.id
											? "text-white"
											: "text-heyhao-blue"
									}`}>
									{cat.name}
								</Text>
							</TouchableOpacity>
						))}
					</ScrollView>
				</View>

				{/* Tab Selector */}
				<View className="flex-row p-4 gap-2">
					<TouchableOpacity
						onPress={() => setTab("GROUP")}
						className={`flex-1 py-3 items-center rounded-xl border ${
							tab === "GROUP"
								? "bg-heyhao-blue border-heyhao-blue"
								: "bg-white border-heyhao-border"
						}`}>
						<Text
							className={`font-bold text-sm ${
								tab === "GROUP" ? "text-white" : "text-heyhao-secondary"
							}`}>
							Groups
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => setTab("PEOPLE")}
						className={`flex-1 py-3 items-center rounded-xl border ${
							tab === "PEOPLE"
								? "bg-heyhao-blue border-heyhao-blue"
								: "bg-white border-heyhao-border"
						}`}>
						<Text
							className={`font-bold text-sm ${
								tab === "PEOPLE" ? "text-white" : "text-heyhao-secondary"
							}`}>
							People
						</Text>
					</TouchableOpacity>
				</View>

				{/* Content */}
				<View className="px-4 py-4 flex-1">
					{tab === "GROUP" ? (
						<FlatList
							data={MOCK_GROUPS}
							keyExtractor={(item) => item.id}
							scrollEnabled={false}
							renderItem={({item}) => (
								<TouchableOpacity className="bg-white border border-heyhao-border rounded-2xl overflow-hidden mb-4 active:bg-heyhao-grey">
									<Image
										source={{uri: item.image}}
										className="w-full h-40"
									/>
									<View className="p-4">
										<View className="flex-row items-center justify-between mb-2">
											<Text className="text-heyhao-black font-bold text-sm flex-1">{item.name}</Text>
											{item.verified && (
												<Icon name="verified" size={16} color="#165dff" />
											)}
										</View>
										<View className="flex-row items-center justify-between">
											<View className="flex-row items-center">
												<Icon name="people" size={14} color="#6a7686" />
												<Text className="text-heyhao-secondary text-xs ml-1">
													{item.members.toLocaleString()} members
												</Text>
											</View>
											<TouchableOpacity className="bg-heyhao-blue rounded-full px-3 py-1">
												<Text className="text-white text-xs font-bold">Join</Text>
											</TouchableOpacity>
										</View>
									</View>
								</TouchableOpacity>
							)}
						/>
					) : (
						<View className="items-center justify-center py-20">
							<Icon name="person-search" size={64} color="#eff2f7" />
							<Text className="text-heyhao-secondary mt-4 text-sm">Coming soon</Text>
						</View>
					)}
				</View>
			</ScrollView>
		</AwareView>
	);
};

export default DiscoverScreen;
