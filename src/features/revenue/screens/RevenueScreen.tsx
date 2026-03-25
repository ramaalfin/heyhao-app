import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	RefreshControl,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BarChart } from "react-native-gifted-charts";
import { useNavigation } from "@react-navigation/native";

import AwareView from "@components/AwareView";
import HeaderBackButton from "@components/Header/HeaderBackButton";
import useTransaction from "@hooks/useTransaction";
import type { RevenueData, LatestMember } from "@services/api/transaction/types";
import { REVENUE_SCREENS } from "@utils/screens";

const RevenueScreen = () => {
	const navigation = useNavigation();
	const { getRevenue, isLoading } = useTransaction();

	const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
	const [refreshing, setRefreshing] = useState(false);

	const fetchRevenue = async () => {
		try {
			const data = await getRevenue();
			setRevenueData(data);
		} catch (error) {
			// Error is already handled inside the hook
		}
	};

	useEffect(() => {
		fetchRevenue();
	}, []);

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchRevenue();
		setRefreshing(false);
	};

	// Prepare chart data
	const chartData = revenueData
		? Object.entries(revenueData.transactionsPerMonths).map(([month, value]) => ({
				value: value / 1000, // Convert to thousands for better display
				label: month,
				frontColor: value > 0 ? "#165dff" : "#d1d5db",
		  }))
		: [];

	const maxValue = Math.max(...chartData.map(d => d.value), 1);

	const renderLatestMember = ({ item }: { item: LatestMember }) => (
		<View className="bg-heyhao-grey rounded-2xl p-4 mb-3 flex-row items-center border border-heyhao-border">
			<View className="w-12 h-12 rounded-full bg-heyhao-blue items-center justify-center mr-3">
				{item.user.photo_url ? (
					<Image
						source={{ uri: item.user.photo_url }}
						className="w-12 h-12 rounded-full"
						resizeMode="cover"
					/>
				) : (
					<Text className="text-white font-bold text-lg">
						{item.user.name.charAt(0).toUpperCase()}
					</Text>
				)}
			</View>
			<View className="flex-1">
				<Text className="text-heyhao-black font-bold text-sm" numberOfLines={1}>
					{item.user.name}
				</Text>
				<Text className="text-heyhao-secondary text-xs" numberOfLines={1}>
					{item.group.name}
				</Text>
			</View>
			<View className="items-end">
				<Text className="text-heyhao-green font-bold text-sm">
					+Rp {item.price.toLocaleString()}
				</Text>
				<Text className="text-heyhao-secondary text-xs">
					{new Date(item.created_at).toLocaleDateString()}
				</Text>
			</View>
		</View>
	);

	if (isLoading && !revenueData) {
		return (
			<AwareView backgroundColor="bg-white">
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#165dff" />
				</View>
			</AwareView>
		);
	}

	return (
		<AwareView backgroundColor="bg-white">
			<ScrollView
				showsVerticalScrollIndicator={false}
				className="w-full h-full bg-white"
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={onRefresh}
						tintColor="#165dff"
					/>
				}
			>
				{/* Header */}
				<View className="px-4 pt-6 pb-6 border-b border-heyhao-border flex-row items-center">
					<HeaderBackButton />
					<Text className="text-2xl font-black text-heyhao-black ml-2">Revenue 💰</Text>
				</View>

				<View className="p-4">
					{/* Balance Card */}
					<View className="bg-heyhao-blue rounded-2xl p-6 mb-6 overflow-hidden relative">
						<View className="absolute -top-10 -right-10 bg-white/10 w-40 h-40 rounded-full" />
						<View className="absolute bottom-0 -left-10 bg-white/5 w-32 h-32 rounded-full" />

						<View className="relative z-10">
							<Text className="text-white/80 text-xs font-bold uppercase tracking-widest mb-2">
								Total Balance
							</Text>
							<Text className="text-white text-4xl font-black mb-6">
								Rp {revenueData?.balance.toLocaleString() || 0}
							</Text>

							<View className="flex-row items-center bg-white/20 px-3 py-2 rounded-full self-start">
								<Icon name="account-balance-wallet" size={14} color="white" />
								<Text className="text-white text-xs font-bold ml-2">
									Total Revenue: Rp {revenueData?.total_revenue.toLocaleString() || 0}
								</Text>
							</View>
						</View>
					</View>

					{/* Stats Cards */}
					<View className="flex-row gap-3 mb-6">
						<View className="flex-1 bg-heyhao-blue/10 rounded-2xl p-4 border border-heyhao-border">
							<Icon name="groups" size={24} color="#165dff" />
							<Text className="text-heyhao-blue font-bold text-2xl mt-2">
								{revenueData?.total_vip_groups || 0}
							</Text>
							<Text className="text-heyhao-secondary text-xs mt-1">VIP Groups</Text>
						</View>
						<View className="flex-1 bg-heyhao-green/10 rounded-2xl p-4 border border-heyhao-border">
							<Icon name="people" size={24} color="#30b22d" />
							<Text className="text-heyhao-green font-bold text-2xl mt-2">
								{revenueData?.total_vip_members || 0}
							</Text>
							<Text className="text-heyhao-secondary text-xs mt-1">VIP Members</Text>
						</View>
					</View>

					{/* Action Buttons */}
					<View className="flex-row gap-3 mb-6">
						<TouchableOpacity
							className="flex-1 bg-heyhao-grey rounded-2xl py-4 items-center border border-heyhao-border active:bg-heyhao-grey/80"
							onPress={() => navigation.navigate(REVENUE_SCREENS.WITHDRAW as never)}
						>
							<Icon name="publish" size={24} color="#165dff" />
							<Text className="text-heyhao-black font-bold text-xs mt-2">Withdraw</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex-1 bg-heyhao-grey rounded-2xl py-4 items-center border border-heyhao-border active:bg-heyhao-grey/80"
							onPress={() => navigation.navigate(REVENUE_SCREENS.PAYOUTS as never)}
						>
							<Icon name="history" size={24} color="#165dff" />
							<Text className="text-heyhao-black font-bold text-xs mt-2">Payouts</Text>
						</TouchableOpacity>
					</View>

					{/* Revenue Chart */}
					{chartData.length > 0 && (
						<View className="mb-6">
							<Text className="text-sm font-bold text-heyhao-secondary uppercase tracking-widest mb-3">
								Revenue Trend (in thousands)
							</Text>
							<View className="bg-white rounded-2xl p-4 border border-heyhao-border">
								<BarChart
									data={chartData}
									width={300}
									height={200}
									barWidth={28}
									spacing={20}
									roundedTop
									roundedBottom
									hideRules
									xAxisThickness={0}
									yAxisThickness={0}
									yAxisTextStyle={{ color: "#6a7686", fontSize: 10 }}
									xAxisLabelTextStyle={{ color: "#6a7686", fontSize: 10 }}
									noOfSections={4}
									maxValue={maxValue * 1.2}
									isAnimated
									animationDuration={800}
								/>
							</View>
						</View>
					)}

					{/* Latest Members */}
					{revenueData?.latest_members && revenueData.latest_members.length > 0 && (
						<View className="mb-4">
							<Text className="text-sm font-bold text-heyhao-secondary uppercase tracking-widest mb-3">
								Latest Members
							</Text>
							<FlatList
								data={revenueData.latest_members}
								keyExtractor={(item) => item.id}
								scrollEnabled={false}
								renderItem={renderLatestMember}
							/>
						</View>
					)}

					{revenueData?.latest_members && revenueData.latest_members.length === 0 && (
						<View className="bg-heyhao-grey rounded-2xl p-8 items-center">
							<Icon name="receipt-long" size={48} color="#d1d5db" />
							<Text className="text-heyhao-secondary font-medium mt-3">
								No transactions yet
							</Text>
						</View>
					)}
				</View>
			</ScrollView>
		</AwareView>
	);
};

export default RevenueScreen;
