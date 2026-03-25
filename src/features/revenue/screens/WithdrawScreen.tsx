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

const WithdrawScreen = () => {
	const navigation = useNavigation();
	const [amount, setAmount] = useState("");
	const [bank, setBank] = useState("");
	const [accountNumber, setAccountNumber] = useState("");

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
					<Text className="text-2xl font-black text-heyhao-black">Withdraw Funds</Text>
				</View>

				<View className="p-6">
					{/* Balance Card */}
					<View className="bg-heyhao-blue/10 rounded-2xl p-4 mb-6 border border-heyhao-blue/20">
						<View className="flex-row items-center">
							<View className="bg-heyhao-blue/20 w-12 h-12 rounded-xl items-center justify-center mr-4">
								<Icon name="account-balance-wallet" size={24} color="#165dff" />
							</View>
							<View className="flex-1">
								<Text className="text-heyhao-secondary text-xs font-bold uppercase tracking-widest mb-1">Available Balance</Text>
								<Text className="text-heyhao-black font-black text-xl">Rp 12,500,000</Text>
							</View>
						</View>
						<View className="mt-3 flex-row items-center justify-between bg-white px-3 py-2 rounded-xl border border-heyhao-border">
							<Text className="text-heyhao-secondary text-xs font-medium">Min. withdrawal: Rp 50,000</Text>
							<TouchableOpacity>
								<Text className="text-heyhao-blue text-xs font-bold">Withdraw All</Text>
							</TouchableOpacity>
						</View>
					</View>

					{/* Form Section */}
					<View className="gap-4 mb-8">
						<View>
							<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Withdraw Amount</Text>
							<TextInput
								onChangeText={setAmount}
								value={amount}
								placeholder="Enter amount (Rp)"
								backgroundColor="bg-heyhao-grey"
								borderLess={false}
								borderColor="border-transparent"
								type="number"
								inputStyle="h-12 rounded-2xl px-4"
							/>
						</View>

						<View>
							<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Bank Destination</Text>
							<TextInput
								onChangeText={setBank}
								value={bank}
								placeholder="Select bank (e.g. BCA, BNI)"
								backgroundColor="bg-heyhao-grey"
								borderLess={false}
								borderColor="border-transparent"
								inputStyle="h-12 rounded-2xl px-4"
							/>
						</View>

						<View>
							<Text className="text-heyhao-black font-bold text-sm mb-2 ml-1">Account Number</Text>
							<TextInput
								onChangeText={setAccountNumber}
								value={accountNumber}
								placeholder="Enter bank account number"
								backgroundColor="bg-heyhao-grey"
								borderLess={false}
								borderColor="border-transparent"
								type="number"
								inputStyle="h-12 rounded-2xl px-4"
							/>
						</View>
					</View>

					{/* Continue Button */}
					<Button
						onPress={() => {}}
						label="Continue Withdrawal"
						buttonBackground="bg-heyhao-blue"
						borderRadius="rounded-2xl"
						buttonHeight="h-12"
						isDisabled={!amount || !bank || !accountNumber}
					/>

					{/* Help Section */}
					<TouchableOpacity className="flex-row items-center justify-center py-4 bg-heyhao-grey px-4 rounded-2xl border border-heyhao-border mt-6">
						<Icon name="help" size={18} color="#6a7686" />
						<Text className="text-heyhao-secondary text-xs font-bold ml-2">Need help with withdrawal?</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</AwareView>
	);
};

export default WithdrawScreen;
