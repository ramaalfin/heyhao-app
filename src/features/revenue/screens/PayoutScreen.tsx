import React from "react";
import {
	FlatList,
	Text,
	View,
} from "react-native";
import AwareView from "@components/AwareView";
import HeaderBackButton from "@components/Header/HeaderBackButton";

const MOCK_PAYOUTS = [
	{
		id: "1",
		bank: "BCA",
		account: "883210XXX",
		name: "Arif Alfin",
		amount: "500,000",
		date: "24 June 2023",
		status: "SUCCESS",
	},
	{
		id: "2",
		bank: "MANDIRI",
		account: "123000XXX",
		name: "Arif Alfin",
		amount: "1,200,000",
		date: "12 June 2023",
		status: "PENDING",
	},
	{
		id: "3",
		bank: "BNI",
		account: "456789XXX",
		name: "Arif Alfin",
		amount: "750,000",
		date: "5 June 2023",
		status: "SUCCESS",
	},
];

const PayoutScreen = () => {
	return (
		<AwareView backgroundColor="bg-white">
			{/* Header */}
			<View className="px-4 pt-4 pb-6 border-b border-heyhao-border flex-row items-center">
				<HeaderBackButton />
				<Text className="text-2xl font-black text-heyhao-black ml-2">Payout History</Text>
			</View>

			<FlatList
				data={MOCK_PAYOUTS}
				keyExtractor={(item) => item.id}
				renderItem={({item}) => (
					<View className="px-4 py-3 border-b border-heyhao-border bg-white">
						<View className="flex-row items-start justify-between mb-3">
							<View className="flex-row items-center flex-1">
								<View className="bg-heyhao-grey px-3 py-1 rounded-lg mr-3 border border-heyhao-border">
									<Text className="text-heyhao-blue font-bold text-xs">{item.bank}</Text>
								</View>
								<View className="flex-1">
									<Text className="text-heyhao-black font-bold text-sm">{item.account}</Text>
									<Text className="text-heyhao-secondary text-xs">{item.name}</Text>
								</View>
							</View>
							<Text className="text-heyhao-secondary text-xs font-medium">{item.date}</Text>
						</View>
						
						<View className="flex-row items-center justify-between">
							<Text className="text-heyhao-coral font-black text-base">Rp {item.amount}</Text>
							<View className={`px-3 py-1 rounded-full ${
								item.status === "SUCCESS" 
									? "bg-heyhao-green/10 border border-heyhao-green/20" 
									: "bg-heyhao-yellow/10 border border-heyhao-yellow/20"
							}`}>
								<Text className={`text-xs font-bold ${
									item.status === "SUCCESS" 
										? "text-heyhao-green" 
										: "text-heyhao-yellow"
								}`}>
									{item.status}
								</Text>
							</View>
						</View>
					</View>
				)}
				contentContainerStyle={{paddingBottom: 20}}
			/>
		</AwareView>
	);
};

export default PayoutScreen;
