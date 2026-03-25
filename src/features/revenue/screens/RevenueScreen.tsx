import React from "react";
import {
	FlatList,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import AwareView from "@components/AwareView";
import Button from "@components/Button";
import { useNavigation } from "@react-navigation/native";
import HeaderBackButton from "@components/Header/HeaderBackButton";

const TRANSACTIONS = [
	{
		id: "1",
		type: "income",
		title: "Group Commission",
		subtitle: "React Native Devs",
		amount: "150,000",
		icon: "arrow-downward",
		color: "#30b22d",
	},
	{
		id: "2",
		type: "expense",
		title: "Withdrawal",
		subtitle: "Bank BCA",
		amount: "500,000",
		icon: "arrow-upward",
		color: "#ed6b60",
	},
	{
		id: "3",
		type: "income",
		title: "Event Sponsorship",
		subtitle: "UI/UX Design",
		amount: "2,000,000",
		icon: "arrow-downward",
		color: "#30b22d",
	},
];

const RevenueScreen = () => {
	const navigation = useNavigation();
	return (
		<AwareView backgroundColor="bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				className="w-full h-full bg-white">
				{/* Header */}
				<View className="px-4 pt-6 pb-6 border-b border-heyhao-border flex-row items-center">
					<HeaderBackButton />
					<Text className="text-2xl font-black text-heyhao-black ml-2">Revenue 💰</Text>
				</View>

				<View className="p-4">
					{/* Balance Card */}
					<View className="bg-gradient-to-br from-heyhao-blue to-heyhao-blue/80 rounded-2xl p-6 mb-6 overflow-hidden relative">
						<View className="absolute -top-10 -right-10 bg-white/10 w-40 h-40 rounded-full" />
						<View className="absolute bottom-0 -left-10 bg-white/5 w-32 h-32 rounded-full" />

						<View className="relative z-10">
							<Text className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">Total Balance</Text>
							<Text className="text-white text-4xl font-black mb-6">Rp 12,500,000</Text>

							<View className="flex-row items-center bg-white/20 px-3 py-2 rounded-full self-start">
								<Icon name="trending-up" size={14} color="white" />
								<Text className="text-white text-xs font-bold ml-2">+12% from last month</Text>
							</View>
						</View>
					</View>

					{/* Action Buttons */}
					<View className="flex-row gap-3 mb-6">
						<TouchableOpacity className="flex-1 bg-heyhao-grey rounded-2xl py-4 items-center border border-heyhao-border active:bg-heyhao-grey/80">
							<Icon name="publish" size={24} color="#165dff" />
							<Text className="text-heyhao-black font-bold text-xs mt-2">Withdraw</Text>
						</TouchableOpacity>
						<TouchableOpacity className="flex-1 bg-heyhao-grey rounded-2xl py-4 items-center border border-heyhao-border active:bg-heyhao-grey/80">
							<Icon name="history" size={24} color="#165dff" />
							<Text className="text-heyhao-black font-bold text-xs mt-2">Payouts</Text>
						</TouchableOpacity>
						<TouchableOpacity className="flex-1 bg-heyhao-grey rounded-2xl py-4 items-center border border-heyhao-border active:bg-heyhao-grey/80">
							<Icon name="download" size={24} color="#165dff" />
							<Text className="text-heyhao-black font-bold text-xs mt-2">Export</Text>
						</TouchableOpacity>
					</View>

					{/* Recent Transactions */}
					<View className="mb-4">
						<Text className="text-sm font-bold text-heyhao-secondary uppercase tracking-widest mb-3">Recent Activity</Text>
						<FlatList
							data={TRANSACTIONS}
							keyExtractor={(item) => item.id}
							scrollEnabled={false}
							renderItem={({ item }) => (
								<View className="bg-heyhao-grey rounded-2xl p-4 mb-3 flex-row items-center border border-heyhao-border">
									<View
										style={{ backgroundColor: item.color + "15" }}
										className="w-12 h-12 rounded-xl items-center justify-center mr-4">
										<Icon name={item.icon} size={20} color={item.color} />
									</View>
									<View className="flex-1">
										<Text className="text-heyhao-black font-bold text-sm">{item.title}</Text>
										<Text className="text-heyhao-secondary text-xs">{item.subtitle}</Text>
									</View>
									<Text className={`font-bold text-sm ${item.type === "income" ? "text-heyhao-green" : "text-heyhao-coral"}`}>
										{item.type === "income" ? "+" : "-"} Rp {item.amount}
									</Text>
								</View>
							)}
						/>
					</View>
				</View>
			</ScrollView>
		</AwareView>
	);
};

export default RevenueScreen;
