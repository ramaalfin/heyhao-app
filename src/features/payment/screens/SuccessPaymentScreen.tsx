import React from "react";
import {
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import AwareView from "@components/AwareView";
import { useNavigation, useRoute } from "@react-navigation/native";

const SuccessPaymentScreen = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { orderId, amount, date } = route.params as { orderId: string; amount: number; date: string };

	const formattedDate = new Date(date).toLocaleDateString("id-ID", {
		day: "numeric",
		month: "long",
		year: "numeric"
	});

	return (
		<AwareView backgroundColor="bg-white">
			<View className="flex-1 w-full px-6 py-12 justify-center items-center bg-white">
				{/* Success Icon */}
				<View className="bg-heyhao-green/10 w-32 h-32 rounded-full items-center justify-center mb-8 border-2 border-heyhao-green/20">
					<View className="bg-heyhao-green w-20 h-20 rounded-full items-center justify-center shadow-lg">
						<Icon name="check" size={48} color="white" />
					</View>
				</View>

				{/* Success Message */}
				<Text className="text-3xl font-black text-heyhao-black text-center mb-2">Payment Successful! 🎉</Text>
				<Text className="text-heyhao-secondary text-base text-center leading-relaxed mb-10">
					Your transaction has been processed and is complete. Thank you for your support!
				</Text>

				{/* Transaction Details */}
				<View className="w-full bg-heyhao-grey rounded-2xl p-6 mb-8 border border-heyhao-border">
					<View className="flex-row justify-between items-center mb-4 pb-4 border-b border-heyhao-border">
						<Text className="text-heyhao-secondary text-xs font-bold uppercase tracking-widest">Transaction ID</Text>
						<Text className="text-heyhao-black font-bold text-sm">#{orderId?.substring(0, 8).toUpperCase()}</Text>
					</View>
					<View className="flex-row justify-between items-center mb-4 pb-4 border-b border-heyhao-border">
						<Text className="text-heyhao-secondary text-xs font-bold uppercase tracking-widest">Amount</Text>
						<Text className="text-heyhao-black font-black text-lg">Rp {amount?.toLocaleString("id-ID")}</Text>
					</View>
					<View className="flex-row justify-between items-center">
						<Text className="text-heyhao-secondary text-xs font-bold uppercase tracking-widest">Date</Text>
						<Text className="text-heyhao-black font-bold text-sm">{formattedDate}</Text>
					</View>
				</View>

				{/* Action Buttons */}
				<View className="w-full gap-3">
					<TouchableOpacity
						onPress={() => {
							navigation.goBack();
						}}
						className="bg-heyhao-blue rounded-2xl py-3 items-center justify-center border border-heyhao-border active:bg-heyhao-grey/80">
						<Text className="text-white font-bold text-sm">Close</Text>
					</TouchableOpacity>
				</View>
			</View>
		</AwareView>
	);
};

export default SuccessPaymentScreen;
