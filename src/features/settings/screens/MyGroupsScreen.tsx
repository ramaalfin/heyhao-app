import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Image,
	RefreshControl,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import AwareView from "@components/AwareView";
import useGroup from "@hooks/useGroup";
import type { OwnGroupList } from "@services/api/group/types";
import { HOME_SCREENS, SETTINGS_SCREENS } from "@utils/screens";
import type { HomeStackParams } from "@navigation/stacks/HomeStack";
import HeaderBackButton from "@components/Header/HeaderBackButton";

type NavigationProp = NativeStackNavigationProp<HomeStackParams>;

const MyGroupsScreen = () => {
	const navigation = useNavigation<NavigationProp>();
	const { getOwnGroups, isLoading } = useGroup();

	const [myGroups, setMyGroups] = useState<OwnGroupList[]>([]);
	const [refreshing, setRefreshing] = useState(false);
	const [stats, setStats] = useState({
		totalMembers: 0,
		paidGroups: 0,
		freeGroups: 0,
	});

	const fetchMyGroups = async () => {
		try {
			const data = await getOwnGroups();
			setMyGroups(data.lists);
			setStats({
				totalMembers: data.total_members,
				paidGroups: data.paid_groups,
				freeGroups: data.free_groups,
			});
		} catch (error) {
			// Error is already handled inside the hook
		}
	};

	useFocusEffect(
		React.useCallback(() => {
			fetchMyGroups();
		}, [])
	);

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchMyGroups();
		setRefreshing(false);
	};

	const handleGroupPress = (groupId: string) => {
		(navigation as any).navigate(HOME_SCREENS.GROUP_DETAIL_SCREEN, { groupId });
	};

	const handleManageGroup = (groupId: string) => {
		(navigation as any).navigate(SETTINGS_SCREENS.MANAGE_GROUP, { groupId });
	};

	const handleCreateGroup = () => {
		(navigation as any).navigate(SETTINGS_SCREENS.MANAGE_GROUP);
	};

	const handleBack = () => {
		navigation.goBack();
	};

	const renderGroupItem = ({ item }: { item: OwnGroupList }) => (
		<TouchableOpacity
			onPress={() => handleGroupPress(item.id)}
			className="bg-white border border-heyhao-border rounded-2xl p-4 mb-3 active:bg-heyhao-grey"
		>
			<View className="flex-row items-center mb-3">
				<View className="w-16 h-16 rounded-xl mr-3 bg-heyhao-grey/50">
					<Image
						source={{ uri: item.photo_url }}
						className="w-16 h-16 rounded-xl"
						resizeMode="cover"
					/>
				</View>
				<View className="flex-1">
					<Text className="text-heyhao-black font-bold text-base" numberOfLines={1}>
						{item.name}
					</Text>
					<View className="flex-row items-center mt-1">
						<Icon name="people" size={14} color="#6a7686" />
						<Text className="text-heyhao-secondary text-xs ml-1">
							{item.total_members} members
						</Text>
						<View className="w-1 h-1 rounded-full bg-heyhao-secondary mx-2" />
						<View className={`px-2 py-0.5 rounded-full ${item.type === "PAID" ? "bg-heyhao-orange/10" : "bg-heyhao-green/10"}`}>
							<Text className={`text-xs font-semibold ${item.type === "PAID" ? "text-heyhao-orange" : "text-heyhao-green"}`}>
								{item.type}
							</Text>
						</View>
					</View>
				</View>
			</View>

			<View className="flex-row gap-2">
				<TouchableOpacity
					onPress={() => handleGroupPress(item.id)}
					className="flex-1 bg-heyhao-blue/10 rounded-xl py-2.5 items-center flex-row justify-center"
				>
					<Icon name="visibility" size={16} color="#165dff" />
					<Text className="text-heyhao-blue font-bold text-xs ml-1">View</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => handleManageGroup(item.id)}
					className="flex-1 bg-heyhao-grey rounded-xl py-2.5 items-center flex-row justify-center"
				>
					<Icon name="settings" size={16} color="#6a7686" />
					<Text className="text-heyhao-secondary font-bold text-xs ml-1">Manage</Text>
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	);

	return (
		<AwareView backgroundColor="bg-white">
			<View className="flex-1 bg-white">
				{/* Header */}
				<View className="px-4 pt-6 pb-4 border-b border-heyhao-border">
					<View className="flex-row items-center justify-between mb-4">
						<View className="flex-row items-center flex-1">
							<HeaderBackButton />
							<Text className="text-2xl font-black text-heyhao-black ml-2">My Groups</Text>
						</View>
					</View>

					{/* Stats */}
					<View className="flex-row gap-2">
						<View className="flex-1 bg-heyhao-blue/10 rounded-xl p-3">
							<Text className="text-heyhao-blue font-bold text-xl">
								{myGroups.length}
							</Text>
							<Text className="text-heyhao-secondary text-xs mt-0.5">
								Total Groups
							</Text>
						</View>
						<View className="flex-1 bg-heyhao-green/10 rounded-xl p-3">
							<Text className="text-heyhao-green font-bold text-xl">
								{stats.freeGroups}
							</Text>
							<Text className="text-heyhao-secondary text-xs mt-0.5">
								Free Groups
							</Text>
						</View>
						<View className="flex-1 bg-heyhao-orange/10 rounded-xl p-3">
							<Text className="text-heyhao-orange font-bold text-xl">
								{stats.paidGroups}
							</Text>
							<Text className="text-heyhao-secondary text-xs mt-0.5">
								Paid Groups
							</Text>
						</View>
					</View>
				</View>

				{/* Groups List */}
				{isLoading && myGroups.length === 0 ? (
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator size="large" color="#165dff" />
					</View>
				) : myGroups.length > 0 ? (
					<FlatList
						data={myGroups}
						keyExtractor={(item) => item.id}
						renderItem={renderGroupItem}
						contentContainerStyle={{ padding: 16 }}
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
							<Icon name="group-add" size={64} color="#d1d5db" />
						</View>
						<Text className="text-heyhao-black font-bold text-xl mb-2">
							No Groups Yet
						</Text>
						<Text className="text-heyhao-secondary text-center mb-6">
							You haven't created any groups yet.{"\n"}Start building your community!
						</Text>
						<TouchableOpacity
							onPress={handleCreateGroup}
							className="bg-heyhao-blue rounded-2xl px-6 py-3 flex-row items-center"
						>
							<Icon name="add-circle" size={20} color="white" />
							<Text className="text-white font-bold text-sm ml-2">
								Create Your First Group
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		</AwareView>
	);
};

export default MyGroupsScreen;
