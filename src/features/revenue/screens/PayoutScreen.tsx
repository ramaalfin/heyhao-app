import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	RefreshControl,
	Text,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

import AwareView from "@components/AwareView";
import HeaderBackButton from "@components/Header/HeaderBackButton";
import useTransaction from "@hooks/useTransaction";
import type { Payout } from "@services/api/transaction/types";

const PayoutScreen = () => {
	const { getPayouts, isLoading } = useTransaction();

	const [payouts, setPayouts] = useState<Payout[]>([]);
	const [refreshing, setRefreshing] = useState(false);

	const fetchPayouts = async () => {
		try {
			const data = await getPayouts();
			setPayouts(data);
		} catch (error) {
			// Error is already handled inside the hook
		}
	};

	useEffect(() => {
		fetchPayouts();
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchPayouts();
		setRefreshing(false);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "APPROVED":
				return {
					bg: "bg-heyhao-green/10",
					border: "border-heyhao-green/20",
					text: "text-heyhao-green",
				};
			case "PENDING":
				return {
					bg: "bg-heyhao-yellow/10",
					border: "border-heyhao-yellow/20",
					text: "text-heyhao-yellow",
				};
			case "REJECTED":
				return {
					bg: "bg-heyhao-coral/10",
					border: "border-heyhao-coral/20",
					text: "text-heyhao-coral",
				};
			default:
				return {
					bg: "bg-heyhao-grey",
					border: "border-heyhao-border",
					text: "text-heyhao-secondary",
				};
		}
	};

	const maskAccountNumber = (accountNumber: string) => {
		if (accountNumber.length <= 4) return accountNumber;
		const lastFour = accountNumber.slice(-4);
		return `${"X".repeat(accountNumber.length - 4)}${lastFour}`;
	};

	const renderPayoutItem = ({ item }: { item: Payout }) => {
		const statusColors = getStatusColor(item.status);

		return (
			<View className="px-4 py-4 border-b border-heyhao-border bg-white">
				<View className="flex-row items-start justify-between mb-3">
					<View className="flex-row items-center flex-1">
						<View className="bg-heyhao-blue/10 w-12 h-12 rounded-xl items-center justify-center mr-3 border border-heyhao-border">
							<Icon name="account-balance" size={20} color="#165dff" />
						</View>
						<View className="flex-1">
							<View className="flex-row items-center mb-1">
								<View className="bg-heyhao-grey px-2 py-1 rounded-lg mr-2 border border-heyhao-border">
									<Text className="text-heyhao-blue font-bold text-xs">
										{item.bank_name}
									</Text>
								</View>
								<Text className="text-heyhao-black font-bold text-sm">
									{maskAccountNumber(item.bank_account_number)}
								</Text>
							</View>
							<Text className="text-heyhao-secondary text-xs" numberOfLines={1}>
								{item.bank_account_name}
							</Text>
						</View>
					</View>
				</View>

				<View className="flex-row items-center justify-between">
					<View>
						<Text className="text-heyhao-coral font-black text-lg">
							Rp {item.amount.toLocaleString()}
						</Text>
						<Text className="text-heyhao-secondary text-xs mt-0.5">
							{new Date(item.created_at).toLocaleDateString("id-ID", {
								day: "numeric",
								month: "long",
								year: "numeric",
							})}
						</Text>
					</View>
					<View className={`px-3 py-1.5 rounded-full ${statusColors.bg} border ${statusColors.border}`}>
						<Text className={`text-xs font-bold ${statusColors.text}`}>
							{item.status}
						</Text>
					</View>
				</View>

				{item.proof && (
					<View className="mt-3 pt-3 border-t border-heyhao-border">
						<View className="flex-row items-center">
							<Icon name="receipt" size={14} color="#6a7686" />
							<Text className="text-heyhao-secondary text-xs ml-1">
								Proof available
							</Text>
						</View>
					</View>
				)}
			</View>
		);
	};

	if (isLoading && payouts.length === 0) {
		return (
			<AwareView backgroundColor="bg-white">
				<View className="px-4 pt-4 pb-6 border-b border-heyhao-border flex-row items-center">
					<HeaderBackButton />
					<Text className="text-2xl font-black text-heyhao-black ml-2">Payout History</Text>
				</View>
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#165dff" />
				</View>
			</AwareView>
		);
	}

	return (
		<AwareView backgroundColor="bg-white">
			{/* Header */}
			<View className="px-4 pt-4 pb-6 border-b border-heyhao-border flex-row items-center">
				<HeaderBackButton />
				<Text className="text-2xl font-black text-heyhao-black ml-2">Payout History</Text>
			</View>

			{payouts.length > 0 ? (
				<FlatList
					data={payouts}
					keyExtractor={(item) => item.id}
					renderItem={renderPayoutItem}
					contentContainerStyle={{ paddingBottom: 20 }}
					showsVerticalScrollIndicator={false}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
							tintColor="#165dff"
						/>
					}
				/>
			) : (
				<View className="flex-1 items-center justify-center px-4">
					<View className="bg-heyhao-grey/50 rounded-full p-6 mb-4">
						<Icon name="receipt-long" size={64} color="#d1d5db" />
					</View>
					<Text className="text-heyhao-black font-bold text-xl mb-2">
						No Payouts Yet
					</Text>
					<Text className="text-heyhao-secondary text-center">
						Your payout history will appear here
					</Text>
				</View>
			)}
		</AwareView>
	);
};

export default PayoutScreen;
