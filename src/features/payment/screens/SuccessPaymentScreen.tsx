import React from "react";
import {
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import AwareView from "@components/AwareView";
import Button from "@components/Button";

const SuccessPaymentScreen = () => {
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
						<Text className="text-heyhao-black font-bold text-sm">#TX2023-001</Text>
					</View>
					<View className="flex-row justify-between items-center mb-4 pb-4 border-b border-heyhao-border">
						<Text className="text-heyhao-secondary text-xs font-bold uppercase tracking-widest">Amount</Text>
						<Text className="text-heyhao-black font-black text-lg">Rp 500,000</Text>
					</View>
					<View className="flex-row justify-between items-center">
						<Text className="text-heyhao-secondary text-xs font-bold uppercase tracking-widest">Date</Text>
						<Text className="text-heyhao-black font-bold text-sm">24 June 2023</Text>
					</View>
				</View>

				{/* Action Buttons */}
				<View className="w-full gap-3">
					<Button
						onPress={() => {}}
						label="Back to Dashboard"
						buttonBackground="bg-heyhao-blue"
						borderRadius="rounded-2xl"
						buttonHeight="h-12"
					/>
					<TouchableOpacity className="bg-heyhao-grey rounded-2xl py-3 items-center justify-center border border-heyhao-border active:bg-heyhao-grey/80">
						<Text className="text-heyhao-blue font-bold text-sm">Download Receipt</Text>
					</TouchableOpacity>
				</View>
			</View>
		</AwareView>
	);
};

export default SuccessPaymentScreen;
